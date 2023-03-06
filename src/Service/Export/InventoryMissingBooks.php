<?php

namespace App\Service\Export;

use App\Entity\Book;
use App\Entity\Inventory;

class InventoryMissingBooks extends Exporter
{
    protected string $title = 'Inventory - Missing books';

    protected array $headers = ['Code', 'Title', 'Location', 'Borrowed by', 'Borrowed since'];

    public function export(Inventory $inventory): string
    {
        $data = array_map(
            function (array $bookDetails) {
                return [
                    $bookDetails['code'],
                    $bookDetails['title'],
                    $bookDetails['location'],
                    $bookDetails['borrower'],
                    $bookDetails['loanStart'],
                ];
            }, $this->manager
            ->getRepository(Book::class)
            ->getBooksNotInInventory($inventory)
        );

        return parent::exportData($data);
    }
}
