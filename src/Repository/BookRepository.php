<?php

namespace App\Repository;


use App\Entity\Book;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class BookRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Book::class);
    }

    /**
     * @return int
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getCount()
    {
        return $this->createQueryBuilder('b')
            ->select('count(b.id)')
            ->getQuery()->getSingleScalarResult()
            ;
    }
}
