<?php

namespace App\Repository;

use App\Entity\Book;
use App\Entity\Location;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityNotFoundException;
use Doctrine\ORM\ORMException;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Symfony\Component\HttpFoundation\Request;

class LocationRepository extends ServiceEntityRepository
{
    /**
     * LocationRepository constructor.
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Location::class);
    }

    /**
     * @param Request $request
     * @return Location
     * @throws EntityNotFoundException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function createLocationFromRequest(Request $request)
    {
        $manager = $this->getEntityManager();
        $locationId = $request->get('id');
        if ($locationId) {
            $location = $manager->getRepository(Location::class)->find($locationId);
            if (!$location) {
                throw new EntityNotFoundException();
            }
        } else {
            $location = new Location();
        }

        $location->setName($request->get('name'));
        $manager->persist($location);
        $manager->flush();

        return $location;
    }

    /**
     * @param Location $location
     * @throws ORMException
     */
    public function removeLocation(Location $location)
    {
        $this->createQueryBuilder('b')
            ->update(Book::class, 'book')
            ->set('book.location', 'null')
            ->where('book.location = :location')
            ->setParameter('location', $location)
            ->getQuery()
            ->getResult()
        ;

        $manager = $this->getEntityManager();
        $manager->remove($location);
        $manager->flush();
    }
}
