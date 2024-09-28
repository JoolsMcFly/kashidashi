<?php

namespace App\Repository;

use App\Entity\Book;
use App\Entity\Loan;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Loan>
 */
class LoanRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Loan::class);
    }

    public function getByBook(Book $book): array
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

    public function getActiveLoansCount(): int
    {
        return $this->createQueryBuilder('l')
            ->select('count(l.id)')
            ->where('l.stoppedAt IS NULL')
            ->getQuery()->getSingleScalarResult()
        ;
    }

    public function getOverdueCount(): int
    {
        return $this->createQueryBuilder('l')
            ->select('count(l.id)')
            ->where('l.stoppedAt IS NULL')
            ->andWhere('l.startedAt < :date')
            ->setParameter('date', new DateTime('3 weeks ago'))
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    public function getOverdue(): array
    {
        return $this->createQueryBuilder('l')
            ->where('l.stoppedAt IS NULL')
            ->andWhere('l.startedAt < :date')
            ->setParameter('date', new DateTime('3 weeks ago'))
            ->orderBy('l.startedAt', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }
}
