<?php

namespace App\Controller\Api;

use App\Entity\Book;
use App\Entity\Borrower;
use App\Entity\Loan;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController
 * @package App\Controller\Api
 * @Route("/api/stats")
 */
class ApiStatsController extends AbstractController
{
    /**
     * @Route("", methods={"GET"})
     * @return JsonResponse
     */
    public function getStats()
    {
        $doctrine = $this->getDoctrine();
        $loanRepository = $doctrine->getRepository(Loan::class);
        $loans = $loanRepository->getActiveLoansCount();
        $overdue = $loanRepository->getOverdueCount();
        $books = $doctrine->getRepository(Book::class)->getCount();
        $borrowers = $doctrine->getRepository(Borrower::class)->getCount();

        return $this->json([
            'books' => $books,
            'borrowers' => $borrowers,
            'loans' => [
                'count' => $loans,
                'overdue' => $overdue,
            ],
        ]);
    }
}
