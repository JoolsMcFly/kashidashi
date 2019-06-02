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
     * @param string $borrowerName
     * @return TypeahedSuggestion[]
     */
    public function findSuggestions(string $borrowerName): array
    {
        $borrowers = $this->manager->getRepository(Borrower::class)->searchBySurname($borrowerName);

        $suggestions = [];
        foreach ($borrowers as $borrower) {
            $text = $borrower->getKatakana() . " (" . $borrower->getSurname() . ")";
            if ($borrower->getSurname() !== $borrower->getFrenchSurname()) {
                $text .= " / " . $borrower->getFrenchSurname();
            }
            $suggestions[] = [
                'id' => $borrower->getId(),
                'text' => $text,
                'item' => [
                    'id' => $borrower->getId(),
                    'surname' => $borrower->getSurname(),
                    'french_surname' => $borrower->getFrenchSurname(),
                    'katakana' => $borrower->getKatakana(),
                    'stats' => $borrower->getStats(),
                ],
                'type' => 'borrower',
            ];
        }

        return $suggestions;
    }
}
