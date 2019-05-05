<?php

namespace App\Service\Export;

use App\Entity\Loan;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class OverdueLoans
{
    /**
     * @var EntityManagerInterface
     */
    private $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @return string
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     * @throws \PhpOffice\PhpSpreadsheet\Writer\Exception
     */
    public function export(): string
    {
        $spreadsheet = new Spreadsheet();
        $worksheet = $spreadsheet->getActiveSheet();
        $worksheet->setTitle('Overdue loans');
        $overdueLoans = $this->manager->getRepository(Loan::class)->getOverdue();
        $data = [['Book code', 'Borrower', 'Book location', 'Loan start date', 'Duration in days', 'Book title']];
        foreach ($overdueLoans as $loan) {
            $borrower = $loan->getBorrower()->getSurname() . ' ' . $loan->getBorrower()->getFirstname();
            $book = $loan->getBook();
            $data[] = [
                $book->getCode(),
                $borrower,
                $book->getLocation(),
                $loan->getStartedAt()->format('Y-m-d'),
                $loan->duration(),
                $book->getTitle(),
            ];
        }
        $worksheet->fromArray($data);

        for ($col = 0; $col < count($data); $col++) {
            $worksheet->getColumnDimension(chr(65 + $col))->setAutoSize(true);
        };

        $filename = '/tmp/overdue-' . date('Y-m-d-H-i-s') . '.xlsx';
        (new Xlsx($spreadsheet))->save($filename);

        return $filename;
    }
}
