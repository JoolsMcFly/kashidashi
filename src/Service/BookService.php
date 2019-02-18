<?php

namespace App\Service;

use App\DataStructures\TypeahedSuggestion;
use App\Entity\Book;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;

final class BookService
{
    /**
     * @var EntityManagerInterface
     */
    private $manager;

    /**
     * @var SerializerInterface
     */
    private $serializer;

    /**
     * UserService constructor.
     * @param EntityManagerInterface $manager
     * @param SerializerInterface $serializer
     */
    public function __construct(EntityManagerInterface $manager, SerializerInterface $serializer)
    {
        $this->manager = $manager;
        $this->serializer = $serializer;
    }

    /**
     * @param string $bookCode
     * @return TypeahedSuggestion[]
     */
    public function findSuggestions(string $bookCode): array
    {
        $books = $this->manager->getRepository(Book::class)->findByCode($bookCode);

        $suggestions = [];
        foreach ($books as $book) {
            $suggestions[] = [
                'text' => $book->getCode() . ' - ' . $book->getTitle(),
                'item' => [
                    'id' => $book->getId(),
                    'title' => $book->getTitle(),
                    'code' => $book->getCode(),
                ],
                'type' => 'book',
            ];
        }

        return $suggestions;
    }
}