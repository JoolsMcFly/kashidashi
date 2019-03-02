<?php

namespace App\Repository;

use App\Entity\Borrower;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class BorrowerRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Borrower::class);
    }

    /**
     * @param string $surname
     * @return Borrower[]
     */
    public function searchBySurname(string $surname)
    {
        return $this->createQueryBuilder('b')
            ->where('LOWER(b.surname) like :name')
            ->setParameter('name', mb_strtolower("$surname%"))
            ->getQuery()
            ->getResult()
            ;
    }

    /**
     * @return int
     */
    public function getCount()
    {
        return $this->createQueryBuilder('b')
            ->select('count(b.id)')
            ->getQuery()->getSingleScalarResult()
            ;
    }
}
