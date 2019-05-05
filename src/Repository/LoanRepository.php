<?php

namespace App\Repository;

use App\Entity\Book;
use App\Entity\Loan;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class LoanRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Loan::class);
    }

    public function getByBook(Book $book): int
    {
        return $this->createQueryBuilder('l')
            ->addSelect('b')
            ->join('l.borrower', 'b')
            ->where('l.book = :book')
            ->andWhere('l.stoppedAt IS null')
            ->setParameter('book', $book)
            ->getQuery()
            ->getResult()
            ;
    }

    public function getActiveLoansCount()
    {
        return $this->createQueryBuilder('l')
            ->select('count(l.id)')
            ->where('l.stoppedAt IS NULL')
            ->getQuery()->getSingleScalarResult()
            ;
    }

    public function getOverdueCount()
    {
        return $this->createQueryBuilder('l')
            ->select('count(l.id)')
            ->where('l.stoppedAt IS NULL')
            ->andWhere('l.startedAt < :date')
            ->setParameter('date', new \DateTime('3 weeks ago'))
            ->getQuery()
            ->getSingleScalarResult()
            ;
    }

    public function getOverdue()
    {
        return $this->createQueryBuilder('l')
            ->where('l.stoppedAt IS NULL')
            ->andWhere('l.startedAt < :date')
            ->setParameter('date', new \DateTime('3 weeks ago'))
            ->getQuery()
            ->getResult()
            ;
    }
}
