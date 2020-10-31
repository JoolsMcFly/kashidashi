<?php

namespace App\Service\Export;

use App\Entity\Book;

class Books extends Exporter
{
    protected $title = 'Books';

    protected $headers = ['Code', 'Title', 'Location'];

    /**
     * @return string
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     * @throws \PhpOffice\PhpSpreadsheet\Writer\Exception
     */
    public function export(): string
    {
        $books = $this->manager->getRepository(Book::class)->findBy([], ['code' => 'asc']);
        $data = [];
        foreach ($books as $book) {
            $data[] = [
                $book->getCode(),
                $book->getTitle(),
                $book->getLocation(),
            ];
        }

        return parent::exportData($data);
    }
}
