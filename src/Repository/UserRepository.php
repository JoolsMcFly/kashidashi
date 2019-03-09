<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Query\QueryException;
use Symfony\Bridge\Doctrine\RegistryInterface;

class UserRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * @return ArrayCollection
     */
    public function getNonAdminUsers()
    {
        try {
            return $this->createQueryBuilder('u')
                ->where("u.roles NOT LIKE '%ROLE_ADMIN%'")
                ->getQuery()
                ->getResult()
                ;
        } catch (QueryException $e) {
            return new ArrayCollection();
        }
    }
}
