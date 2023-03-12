<?php

namespace App\Repository;

use App\Entity\Book;
use App\Entity\Inventory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;

class BookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Book::class);
    }

    public function getBookWithCurrentLoan(string $bookCode): ?Book
    {
        return $this->createQueryBuilder('b')
            ->addSelect('loans' ,'borrower')
            ->leftJoin('b.loans', 'loans')
            ->leftJoin('loans.borrower', 'borrower')
            ->where('b.code = :bookCode')
            ->setParameter('bookCode', $bookCode)
            ->orderBy('loans.startedAt', 'desc')
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getTotalBookCount(): int
    {
        return $this->createQueryBuilder('b')
            ->select('count(b.id)')
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    public function getBooksNotInInventory(Inventory $inventory): array
    {
        return $this->getEntityManager()->getConnection()
            ->fetchAllAssociative('
                SELECT b.code, b.title, loc.name AS location,  l.started_at AS loanStart, CONCAT(borrower.katakana, " / ", borrower.french_surname) AS borrower
                FROM book b
                LEFT JOIN location loc ON b.location_id = loc.id
                LEFT JOIN loan l ON b.id = l.book_id
                LEFT JOIN borrower ON borrower.id = l.borrower_id
                WHERE b.id NOT IN (SELECT book_id from inventory_item ii WHERE ii.inventory_id = :inventory)
                AND l.stopped_at IS NULL
                ',
                ['inventory' => $inventory->getId()]
            )
        ;
    }

    public function countBooksNotInInventory(Inventory $inventory): int
    {
        return $this->getEntityManager()->getConnection()
            ->fetchOne('
                SELECT COUNT(*)
                FROM book
                WHERE id NOT IN (SELECT book_id from inventory_item ii WHERE ii.inventory_id = :inventory)',
                ['inventory' => $inventory->getId()]
            )
        ;
    }

    /**
     * @return mixed
     */
    public function indexByCode()
    {
        return $this->createQueryBuilder('b', 'b.code')
            ->getQuery()
            ->getResult()
        ;
    }
}
