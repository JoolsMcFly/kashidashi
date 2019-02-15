<?php

namespace App\Controller\Api;

use App\Entity\Book;
use App\Entity\Borrower;
use App\Entity\Loan;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController
 * @package App\Controller\Api
 * @Route("/api/loans")
 */
class ApiLoansController extends AbstractController
{
    /**
     * @var SerializerInterface
     */
    private $serializer;

    /**
     * ApiBorrowerController constructor.
     * @param SerializerInterface $serializer
     */
    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }

    /**
     * @Route("/by-user/{borrower}", methods={"GET"})
     * @param Borrower $borrower
     * @return JsonResponse
     */
    public function loanByUser(Borrower $borrower)
    {
        $loans = $this->getDoctrine()->getRepository(Loan::class)->findBy([
            'borrower' => $borrower,
        ])
        ;

        $context = (new SerializationContext())->setGroups(['details']);

        return new JsonResponse(
            $this->serializer->serialize($loans, 'json', $context),
            Response::HTTP_OK,
            [],
            true
        );
    }

    /**
     * @Route("/by-user/{borrower}/{bookCode}", methods={"POST"})
     * @param Borrower $borrower
     * @param string $bookCode
     * @return JsonResponse
     * @throws \Exception
     */
    public function addLoan(Borrower $borrower, string $bookCode)
    {
        $doctrine = $this->getDoctrine();
        $book = $doctrine->getRepository(Book::class)->findOneBy(['code' => $bookCode]);
        if (empty($book)) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        $existingLoan = $doctrine->getRepository(Loan::class)->findOneBy(['book' => $book]);
        if (!empty($existingLoan)) {
            return $this->json(null, Response::HTTP_CONFLICT);
        }

        $loan = new Loan();
        $loan->setBorrower($borrower)
            ->setBook($book)
            ->setStartedAt(new \DateTime())
        ;

        $manager = $doctrine->getManager();
        $manager->persist($loan);
        $manager->flush();

        return $this->json(null);
    }
}
