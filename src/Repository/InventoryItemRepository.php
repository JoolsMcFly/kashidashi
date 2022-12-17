<?php

namespace App\Repository;

use App\Entity\Inventory;
use App\Entity\InventoryItem;
use App\Entity\Location;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\ConnectionException;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method InventoryItem|null find($id, $lockMode = null, $lockVersion = null)
 * @method InventoryItem|null findOneBy(array $criteria, array $orderBy = null)
 * @method InventoryItem[]    findAll()
 * @method InventoryItem[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InventoryItemRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, InventoryItem::class);
    }

    public function isCodeAlreadyAdded(Inventory $inventory, string $code): bool
    {
        try {
            $this->createQueryBuilder('ii')
                ->join('ii.book', 'book')
                ->where('book.code = :code')
                ->andWhere('ii.inventory = :id')
                ->setParameters([
                    'id' => $inventory,
                    'code' => (int)$code,
                ])
                ->getQuery()
                ->getSingleResult()
            ;

            return true;
        } catch (NoResultException|NonUniqueResultException $e) {
            return false;
        }
    }

    public function removeCode(Inventory $inventory, string $code): bool
    {
        try {
            $inventoryItems = $this->createQueryBuilder('ii')
                ->select('ii', 'book')
                ->join('ii.book', 'book')
                ->leftJoin('ii.belongsAt', 'location')
                ->where('book.code = :code')
                ->andWhere('ii.inventory = :id')
                ->setParameters([
                    'id' => $inventory,
                    'code' => (int)$code,
                ])
                ->getQuery()
                ->getResult()
            ;

            $manager = $this->getEntityManager();
            $connection = $manager->getConnection();
            $connection->beginTransaction();

            $itemIds = [];
            /** @var InventoryItem $inventoryItem */
            foreach ($inventoryItems as $inventoryItem) {
                $itemIds[] = $inventoryItem->getId();
                $book = $inventoryItem->getBook();
                $book->setLocation($inventoryItem->getBelongsAt());
                $manager->persist($inventoryItem);
            }

            $deleted = $this->createQueryBuilder('ii')
                ->where('ii.id IN (:ids)')
                ->setParameter('ids', $itemIds)
                ->delete()
                ->getQuery()
                ->getResult()
            ;

            $manager->flush();
            $connection->commit();

            return $deleted > 0;
        } catch (ConnectionException|OptimisticLockException|ORMException $e) {
            return false;
        }
    }

    private function qbBooksToMove(Inventory $inventory): QueryBuilder
    {
        return $this->createQueryBuilder('ii')
            ->where('ii.inventory = :inventory')
            ->andWhere('ii.belongsAt IS NULL OR ii.belongsAt != ii.foundAt')
            ->join('ii.book', 'book')
            ->leftJoin('ii.belongsAt', 'previousLocation')
            ->setParameter('inventory', $inventory)
        ;
    }

    public function countBooksToMove(Inventory $inventory): int
    {
        return $this->qbBooksToMove($inventory)
            ->select('COUNT(ii.id)')
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    public function findBooksToMove(Inventory $inventory)
    {
        return $this->qbBooksToMove($inventory)
            ->select('book.title', 'book.code', 'previousLocation.name as previousLoc')
            ->getQuery()
            ->getArrayResult()
        ;
    }

    // TODO use a data structure
    public function getItemsToMove(Inventory $inventory, Location $location = null): array
    {
        $qb = $this->createQueryBuilder('ii')
            ->select('book.code', 'book.title', 'belongsAtLocation.name AS location')
            ->join('ii.inventory', 'inventory')
            ->join('ii.book', 'book')
            ->leftJoin('ii.belongsAt', 'belongsAtLocation')
            ->where('ii.inventory = :inventory')
            ->andWhere('ii.belongsAt IS NULL OR ii.belongsAt != ii.foundAt')
            ->setParameter('inventory', $inventory)
        ;
        if ($location) {
            $qb->andWhere('ii.foundAt = :location')
                ->setParameter('location', $location)
            ;
        }
        $items = $qb->getQuery()->getResult();

        $itemsByLocation = [];
        foreach ($items as $item) {
            $itemsByLocation[$item['location'] ?? 'Unspecified'][] = [
                'code' => $item['code'],
                'title' => $item['title'],
            ];
        }

        return $itemsByLocation;
    }
}
