<?php

namespace App\Service;

use App\DataStructures\TypeahedSuggestion;
use App\Entity\Borrower;
use Doctrine\ORM\EntityManagerInterface;

final class BorrowerService
{
    private EntityManagerInterface $manager;

    /**
     * UserService constructor.
     * @param EntityManagerInterface $manager
     */
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
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
            $fullName = $borrower->getFullName();
            $suggestions[] = [
                'id' => $borrower->getId(),
                'text' => $fullName,
                'item' => [
                    'id' => $borrower->getId(),
                    'surname' => $borrower->getSurname(),
                    'french_surname' => $borrower->getFrenchSurname(),
                    'katakana' => $borrower->getKatakana(),
                    'stats' => $borrower->getStats(),
                    'fullname' => $fullName,
                ],
                'type' => 'borrower',
            ];
        }

        return $suggestions;
    }
}
