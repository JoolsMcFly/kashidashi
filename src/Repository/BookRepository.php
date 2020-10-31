<?php

namespace App\Repository;

use App\Entity\Book;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;

class BookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Book::class);
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

    /**
     * @param array $ids
     * @return ArrayCollection
     */
    public function findNotIn(array $ids)
    {
        $ids = $this->createQueryBuilder('b')
            ->select('b.id')
            ->where("b.id NOT IN (:ids)")
            ->setParameter('ids', $ids, Connection::PARAM_INT_ARRAY)
            ->getQuery()
            ->getResult()
        ;

        return array_map(function ($element) {
            return $element['id'];
        }, $ids);
    }

    /**
     * @param array $ids
     * @return ArrayCollection
     */
    public function getMissingBooks(array $ids)
    {
        return $this->createQueryBuilder('b')
            ->addSelect('l')
            ->leftJoin('b.loans', 'l', Join::WITH, 'l.stoppedAt IS NULL')
            ->where('b.id IN (:ids)')
            ->setParameter('ids', $ids, Connection::PARAM_INT_ARRAY)
            ->getQuery()
            ->getResult()
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

    /**
     * @param array $codes
     */
    public function removeNotInCodeList(array $codes)
    {
        $this->createQueryBuilder('books')
            ->delete(Book::class, 'b')
            ->where('b.code NOT IN (:codes)')
            ->setParameter('codes', $codes, Connection::PARAM_INT_ARRAY)
            ->getQuery()
            ->getResult()
            ;
    }
}
