<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityNotFoundException;
use Doctrine\ORM\Query\QueryException;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserRepository extends ServiceEntityRepository
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * UserRepository constructor.
     * @param RegistryInterface $registry
     * @param UserPasswordEncoderInterface $encoder
     */
    public function __construct(RegistryInterface $registry, UserPasswordEncoderInterface $encoder)
    {
        parent::__construct($registry, User::class);
        $this->encoder = $encoder;
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

    /**
     * @param Request $request
     * @return User
     * @throws EntityNotFoundException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function createUserFromRequest(Request $request)
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
        $user
            ->setFirstname($request->get('firstname'))
            ->setSurname($request->get('surname'))
            ->setEmail($request->get('email'))
            ->setRoles([$request->get('role')])
        ;
        if (!empty($plainPassword)) {
            $user->setPassword($this->encoder->encodePassword($user, $plainPassword));
        }
        $manager->persist($user);
        $manager->flush();

        return $user;
    }
}
