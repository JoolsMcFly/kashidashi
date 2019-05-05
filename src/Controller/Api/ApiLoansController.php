<?php

namespace App\Controller\Api;

use App\Entity\Book;
use App\Entity\Borrower;
use App\Entity\Loan;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController
 * @package App\Controller\Api
 * @Route("/api/loans")
 */
class ApiLoansController extends ApiBaseController
{
    /**
     * @Route("/by-user/{borrower}", methods={"GET"})
     * @param Borrower $borrower
     * @return JsonResponse
     */
    public function getLoansByUser(Borrower $borrower)
    {
        $loans = $this->getDoctrine()->getRepository(Loan::class)->findBy([
            'borrower' => $borrower,
            'stoppedAt' => null,
        ])
        ;

        return $this->serializeLoans($loans);
    }

    /**
     * @Route("/by-book/{book}", methods={"GET"})
     * @param Book $book
     * @return JsonResponse
     */
    public function getLoansByBook(Book $book)
    {
        $loans = $this->getDoctrine()->getRepository(Loan::class)->getByBook($book);

        return $this->serializeLoans($loans);
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
        try {
            $doctrine = $this->getDoctrine();
            $book = $doctrine->getRepository(Book::class)->findOneBy(['code' => $bookCode]);
            if (empty($book)) {
                return $this->json("Book code $bookCode does not exist.", Response::HTTP_NOT_FOUND);
            }
            $existingLoan = $doctrine->getRepository(Loan::class)->findOneBy([
                'book' => $book,
                'stoppedAt' => null,
            ])
            ;
            if (!empty($existingLoan)) {
                return $this->json("Book already borrowed by {$existingLoan->getBorrower()}.", Response::HTTP_CONFLICT);
            }
            $loan = new Loan();
            $loan->setBorrower($borrower)
                ->setBook($book)
                ->setStartedAt(new \DateTime())
                ->setCreator($this->getUser())
            ;
            $borrower->incLoansCount();
            $book->incLoansCount();
            $manager = $doctrine->getManager();
            $manager->persist($loan);
            $manager->persist($borrower);
            $manager->flush();
            $context = (new SerializationContext())->setGroups(['details']);

            return new JsonResponse(
                $this->serialize($loan, $context),
                Response::HTTP_OK,
                [],
                true
            );
        } catch (\Exception $e) {
            $this->json('An error occurred when saving your book loan.', Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/{loan}", methods={"PUT"})
     * @param Loan $loan
     * @return JsonResponse
     * @throws \Exception
     */
    public function endLoan(Loan $loan)
    {
        try {
            $loan->setStoppedAt(new \DateTime());

            $book = $loan->getBook();
            $borrower = $loan->getBorrower();

            $durationInDays = $loan->getStoppedAt()->diff($loan->getStartedAt())->days;
            $book->incLoansDuration($durationInDays);
            $borrower->incLoansDuration($durationInDays);

            $manager = $this->getDoctrine()->getManager();
            $manager->persist($loan);
            $manager->persist($book);
            $manager->persist($borrower);
            $manager->flush();

            return $this->json(null);
        } catch (\Exception $e) {
            return $this->json(null, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/overdue", name="api_overdue_loans_list", methods={"GET"})
     * @return JsonResponse
     */
    public function overdueLoans()
    {
        $loans = $this->getDoctrine()->getRepository(Loan::class)->getOverdue();
sleep(2);
        return $this->serializeLoans($loans);
    }

    private function serializeLoans(array $loans): JsonResponse
    {
        $context = (new SerializationContext())->setGroups(['details']);

        return new JsonResponse(
            $this->serialize($loans, $context),
            Response::HTTP_OK,
            [],
            true
        );
    }
}
