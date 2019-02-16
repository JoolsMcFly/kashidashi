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
            ->where('b.surname like :name')
            ->setParameter('name', "$surname%")
            ->getQuery()
            ->getResult()
            ;
    }
}
