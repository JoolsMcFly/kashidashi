<?php

namespace App\Service;

use App\DataStructures\TypeahedSuggestion;
use App\Entity\Borrower;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;

final class BorrowerService
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
     * @return Borrower[]
     */
    public function getBorrowers()
    {
        return $this->manager->getRepository(Borrower::class)->findAll();
    }

    /**
     * @param string $borrowerName
     * @return TypeahedSuggestion[]
     */
    public function findSuggestions(string $borrowerName): array
    {
        $borrowers = $this->manager->getRepository(Borrower::class)->searchBySurname($borrowerName);

        $suggestions = [];
        foreach ($borrowers as $borrower) {
            $suggestions[] = [
                'id' => $borrower->getId(),
                'text' => $borrower->getSurname() . ' ' . $borrower->getFirstname(),
                'item' => [
                    'id' => $borrower->getId(),
                    'firstname' => $borrower->getFirstname(),
                    'surname' => $borrower->getSurname(),
                    'stats' => $borrower->getStats(),
                ],
                'type' => 'borrower',
            ];
        }

        return $suggestions;
    }
}
