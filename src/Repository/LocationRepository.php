<?php

namespace App\Repository;

use App\Entity\Location;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class LocationRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
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
}
