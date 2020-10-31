<?php

namespace App\Service\Export;

use App\Entity\Loan;

class OverdueLoans extends Exporter
{
    protected $title = 'Overdue loans';

    protected $headers = [
        'Book code',
        'Borrower',
        'Book location',
        'Loan start date',
        'Duration in days',
        'Book title',
    ];

    /**
     * @return string
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     * @throws \PhpOffice\PhpSpreadsheet\Writer\Exception
     */
    public function export(): string
    {
        $overdueLoans = $this->manager->getRepository(Loan::class)->getOverdue();
        $data = [];
        foreach ($overdueLoans as $loan) {
            $borrower = $loan->getBorrower()->getSurname().' '.$loan->getBorrower()->getFirstname();
            $book = $loan->getBook();
            $data[] = [
                $book->getCode(),
                $borrower,
                $book->getLocation() ? $book->getLocation()->getName() : '',
                $loan->getStartedAt()->format('Y-m-d'),
                $loan->duration(),
                $book->getTitle(),
            ];
        }

        return parent::exportData($data);
    }
}
