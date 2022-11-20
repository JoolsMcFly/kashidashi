<?php

namespace App\Repository;

use App\Entity\Borrower;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class BorrowerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Borrower::class);
    }

    public function getAll()
    {
        return $this->createQueryBuilder('b', 'b.id')
            ->orderBy('b.katakana', 'asc')
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * @return Borrower[]
     */
    public function searchBySurname(string $surname): array
    {
        return $this->createQueryBuilder('b')
            ->where('b.surname like :name OR b.katakana LIKE :name OR b.frenchSurname LIKE :name')
            ->setParameter('name', mb_strtolower("$surname%"))
            ->getQuery()
            ->getResult()
        ;
    }

    public function getCount(): int
    {
        return $this->createQueryBuilder('b')
            ->select('count(b.id)')
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }
}
