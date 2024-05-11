<?php

namespace App\Controller\Api;

use App\Repository\BookRepository;
use App\Repository\BorrowerRepository;
use App\Repository\LoanRepository;
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
    private LoanRepository $loanRepository;

    private BookRepository $bookRepository;

    private BorrowerRepository $borrowerRepository;

    public function __construct(LoanRepository $loanRepository, BookRepository $bookRepository, BorrowerRepository $borrowerRepository)
    {
        $this->loanRepository = $loanRepository;
        $this->bookRepository = $bookRepository;
        $this->borrowerRepository = $borrowerRepository;
    }

    /**
     * @Route("", methods={"GET"})
     */
    public function getStats(): JsonResponse
    {
        $loans = $this->loanRepository->getActiveLoansCount();
        $overdue = $this->loanRepository->getOverdueCount();
        $books = $this->bookRepository->getTotalBookCount();
        $borrowers = $this->borrowerRepository->getCount();

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
