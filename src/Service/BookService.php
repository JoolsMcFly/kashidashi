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
        $books = $this->manager->getRepository(Book::class)->findByCode((int)$bookCode);

        preg_match('|^([0]*)[1-9]|', $bookCode, $matches);
        if (isset($matches[1])) {
            $leadingZeros = $matches[1];
        } else {
            $leadingZeros = '';
        }
        $suggestions = [];
        foreach ($books as $book) {
            $suggestions[] = [
                'text' => $leadingZeros . $book->getCode() . ' - ' . $book->getTitle(),
                'item' => [
                    'id' => $book->getId(),
                    'title' => $book->getTitle(),
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
