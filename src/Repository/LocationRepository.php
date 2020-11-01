<?php

namespace App\Repository;

use App\Entity\Location;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class LocationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Location::class);
    }

    public function bookCount()
    {
        return $this->createQueryBuilder('location')
            ->select('location', "count(books.id) as count")
            ->join('location.books', 'books')
            ->getQuery()
            ->getResult()
            ;
    }

    /**
     * @return Location[]
     */
    public function getWithActiveInventories()
    {
        return $this->createQueryBuilder('l')
            ->select('l')
            ->addSelect('inventories')
            ->join('l.inventories', 'inventories')
            ->where('inventories.stoppedAt IS NULL')
            ->orderBy('l.name')
            ->addOrderBy('inventories.startedAt')
            ->getQuery()
            ->getResult()
            ;
    }
}
