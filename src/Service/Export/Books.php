<?php

namespace App\Service\Export;

use App\Entity\Book;
use App\Entity\Location;

class Books extends Exporter
{
    protected string $title = 'Books';

    protected array $headers = ['Code', 'Title', 'Location'];

    public function export(?Location $location = null): string
    {
        $bookRepository = $this->manager->getRepository(Book::class);
        if ($location) {
            $this->title .= '-'.$location->getName();
        }
        $data = array_map(function (Book $book) {
            return [
                $book->getCode(),
                $book->getTitle(),
                $book->getLocation(),
            ];
        },
            $bookRepository->getBooks($location)
        );

        return parent::exportData($data);
    }
}
