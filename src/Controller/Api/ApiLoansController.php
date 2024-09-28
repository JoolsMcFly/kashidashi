<?php

namespace App\Controller\Api;

use _Entity\Book;
use _Entity\Borrower;
use _Entity\Loan;
use DateTime;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController.
 */
#[Route(path: '/api/loans')]
class ApiLoansController extends ApiBaseController
{
    #[Route(path: '/by-user/{borrower}', methods: ['GET'])]
    public function getLoansByUser(Borrower $borrower): JsonResponse
    {
        $loans = $this->getDoctrine()->getRepository(Loan::class)->findBy([
            'borrower' => $borrower,
            'stoppedAt' => null,
        ]);

        return $this->serializeLoans($loans);
    }

    #[Route(path: '/by-book/{book}', methods: ['GET'])]
    public function getLoansByBook(Book $book): JsonResponse
    {
        $loans = $this->getDoctrine()->getRepository(Loan::class)->getByBook($book);

        return $this->serializeLoans($loans);
    }

    #[Route(path: '/by-user/{borrower}/{bookCode}', methods: ['POST'])]
    public function addLoan(Borrower $borrower, string $bookCode): JsonResponse
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
            ]);
            if (!empty($existingLoan)) {
                return $this->json("Book already borrowed by {$existingLoan->getBorrower()}.", Response::HTTP_CONFLICT);
            }
            $loan = new Loan();
            $loan->setBorrower($borrower)
                ->setBook($book)
                ->setStartedAt(new DateTime())
                ->setCreator($this->getUser())
            ;
            $borrower->incLoansCount();
            $book->incLoansCount();
            $manager = $doctrine->getManager();
            $manager->persist($loan);
            $manager->persist($borrower);
            $manager->flush();

            return new JsonResponse(
                $this->serialize($loan, ['groups' => ['details']]),
                Response::HTTP_OK,
                [],
                true
            );
        } catch (Exception $e) {
            return $this->json('An error occurred when saving your book loan.', Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route(path: '/{loan}', methods: ['PUT'])]
    public function endLoan(Loan $loan): JsonResponse
    {
        try {
            $manager = $this->getDoctrine()->getManager();
            $loan->setStoppedAt(new DateTime());

            $book = $loan->getBook();
            $borrower = $loan->getBorrower();

            $durationInDays = $loan->getStoppedAt()->diff($loan->getStartedAt())->days;
            if ($durationInDays <= 0) {
                $manager->remove($loan);
            } else {
                $book->incLoansDuration($durationInDays);
                $borrower->incLoansDuration($durationInDays);

                $manager->persist($loan);
                $manager->persist($book);
                $manager->persist($borrower);
            }
            $manager->flush();

            return $this->json(null);
        } catch (Exception $e) {
            return $this->json(null, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route(path: '/overdue', name: 'api_overdue_loans_list', methods: ['GET'])]
    public function overdueLoans(): JsonResponse
    {
        $loans = $this->getDoctrine()->getRepository(Loan::class)->getOverdue();

        return $this->serializeLoans($loans);
    }

    private function serializeLoans(array $loans): JsonResponse
    {
        return new JsonResponse(
            $this->serialize($loans, ['groups' => ['loan-details']]),
            Response::HTTP_OK,
            [],
            true
        );
    }
}
