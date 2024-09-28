<?php

namespace App\Repository;

use App\Entity\Inventory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Inventory>
 */
class InventoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Inventory::class);
    }

    public function getOpenInventory(): ?Inventory
    {
        try {
            return $this->createQueryBuilder('i')
                ->where('i.stoppedAt IS NULL')
                ->getQuery()
                ->getSingleResult()
            ;
        } catch (NoResultException|NonUniqueResultException $e) {
            return null;
        }
    }
}
