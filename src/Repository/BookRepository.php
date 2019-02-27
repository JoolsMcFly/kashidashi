<?php

namespace App\Repository;

use App\Entity\Book;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Types\Type;
use Symfony\Bridge\Doctrine\RegistryInterface;

class BookRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
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
}
