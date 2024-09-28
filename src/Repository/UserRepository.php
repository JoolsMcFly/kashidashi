<?php

namespace App\Repository;

use App\Entity\Location;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityNotFoundException;
use Doctrine\ORM\Query\QueryException;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(ManagerRegistry $registry, UserPasswordHasherInterface $passwordHasher)
    {
        parent::__construct($registry, User::class);
        $this->passwordHasher = $passwordHasher;
    }

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

    public function createUserFromRequest(Request $request): User
    {
        $manager = $this->getEntityManager();
        $userId = $request->get('id');
        if ($userId) {
            $user = $manager->getRepository(User::class)->find($userId);
            if (!$user) {
                throw new EntityNotFoundException();
            }
        } else {
            $user = new User();
        }

        $plainPassword = $request->get('password');
        $locationId = $request->get('location');
        $roles = explode(',', $request->get('roles'));
        $user
            ->setFirstname($request->get('firstname'))
            ->setSurname($request->get('surname'))
            ->setEmail($request->get('email'))
            ->setRoles(array_values(array_filter($roles)))
            ->setLocation(
                $locationId ? $manager->getRepository(Location::class)->find($locationId) : null
            )
        ;
        if (!empty($plainPassword)) {
            $user->setPassword($this->passwordHasher->hashPassword($user, $plainPassword));
        }
        $manager->persist($user);
        $manager->flush();

        return $user;
    }

    public function remove(User $user): void
    {
        $this->getEntityManager()->remove($user);
        $this->getEntityManager()->flush();
    }
}
