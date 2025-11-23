<?php

namespace App\Repository;

use App\Entity\Location;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityNotFoundException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserRepository extends ServiceEntityRepository
{
    private UserPasswordEncoderInterface $encoder;

    public function __construct(ManagerRegistry $registry, UserPasswordEncoderInterface $encoder)
    {
        parent::__construct($registry, User::class);
        $this->encoder = $encoder;
    }

    public function getNonAdminUsers(): array
    {
        return $this->createQueryBuilder('u')
            ->where("u.roles NOT LIKE '%ROLE_ADMIN%'")
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * @throws EntityNotFoundException
     * @throws ORMException
     * @throws OptimisticLockException
     */
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
            $user->setPassword($this->encoder->encodePassword($user, $plainPassword));
        }
        $manager->persist($user);
        $manager->flush();

        return $user;
    }
}
