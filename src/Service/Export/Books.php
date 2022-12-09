<?php

namespace App\Service\Export;

use App\Entity\Book;
use App\Entity\Location;

class Books extends Exporter
{
    protected $title = 'Books';

    protected $headers = ['Code', 'Title', 'Location'];

    public function export(Location $location = null): string
    {
        if ($location) {
            $this->title .= '-'.$location->getName();
            $params = ['location' => $location];
        } else {
            $params = [];
        }
        $data = array_map(function (Book $book) {
            return [
                $book->getCode(),
                $book->getTitle(),
                $book->getLocation(),
            ];
        },
            $this->manager
                ->getRepository(Book::class)
                ->findBy($params, ['code' => 'asc'])
        );

        return parent::exportData($data);
    }
}
