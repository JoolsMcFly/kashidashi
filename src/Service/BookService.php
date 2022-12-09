<?php

namespace App\Service;

use App\DataStructures\TypeahedSuggestion;
use App\Entity\Book;
use Doctrine\ORM\EntityManagerInterface;

final class BookService
{
    private EntityManagerInterface $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @return TypeahedSuggestion[]
     */
    public function findSuggestions(string $bookCode): array
    {
        $books = $this->manager->getRepository(Book::class)->findByCode((int)$bookCode);

        preg_match('|^([0]*)[1-9]|', $bookCode, $matches);
        $leadingZeros = $matches[1] ?? '';
        $suggestions = [];
        foreach ($books as $book) {
            $bookTitle = $book->getTitle()?: 'no title';
            $suggestions[] = [
                'text' => $leadingZeros . $book->getCode() . ' - ' . $bookTitle,
                'item' => [
                    'id' => $book->getId(),
                    'title' => $bookTitle,
                    'code' => $book->getCode(),
                    'stats' => $book->getStats(),
                    'location' => $book->getLocation() ? $book->getLocation()->getName() : null,
                ],
                'type' => 'book',
            ];
        }

        return $suggestions;
    }
}
