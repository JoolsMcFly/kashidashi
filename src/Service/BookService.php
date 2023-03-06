<?php

namespace App\Service;

use App\DataStructures\TypeahedSuggestion;
use App\Repository\BookRepository;

final class BookService
{
    private BookRepository $bookRepository;

    public function __construct(BookRepository $bookRepository)
    {
        $this->bookRepository = $bookRepository;
    }

    /**
     * @return TypeahedSuggestion[]
     */
    public function findSuggestions(string $bookCode): array
    {
        $books = $this->bookRepository->findByCode((int)$bookCode);

        preg_match('|^([0]*)[1-9]|', $bookCode, $matches);
        $leadingZeros = $matches[1] ?? '';
        $suggestions = [];
        foreach ($books as $book) {
            $bookTitle = $book->getTitle() ?: 'no title';
            $suggestion = [
                'text' => $leadingZeros.$book->getCode().' - '.$bookTitle,
                'item' => [
                    'id' => $book->getId(),
                    'title' => $bookTitle,
                    'code' => $book->getCode(),
                    'stats' => $book->getStats(),
                    'location' => $book->getLocation() ? $book->getLocation()->getName() : null,
                ],
                'type' => 'book',
            ];
            $location = $book->getLocation();
            if ($location) {
                $suggestion['item']['location'] = [
                    'id' => $location->getId(),
                    'name' => $location->getName(),
                ];
            }
            $suggestions[] = $suggestion;
        }

        return $suggestions;
    }
}
