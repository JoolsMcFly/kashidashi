<?php

namespace App\Service\Export;

use App\Entity\Book;
use App\Entity\Borrower;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class Books
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
        $worksheet->setTitle('Books');
        $books = $this->manager->getRepository(Book::class)->findBy([], ['code' => 'asc']);
        $headers = ['Code', 'Title', 'Location'];
        $data = [$headers];
        foreach ($books as $book) {
            $data[] = [
                $book->getCode(),
                $book->getTitle(),
                $book->getLocation(),
            ];
        }
        $worksheet->fromArray($data);

        $headersCount = count($headers);
        $letter = 'A';
        for ($col = 0; $col < $headersCount; $col++) {
            $worksheet->getColumnDimension($letter)->setAutoSize(true);
            $letter++;
        }

        $filename = '/tmp/books-' . date('Y-m-d-H-i-s') . '.xlsx';
        (new Xlsx($spreadsheet))->save($filename);

        return $filename;
    }
}
