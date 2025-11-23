<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    /**
     * @var UserPasswordEncoder
     */
    private $passwordEncoder;

    /**
     * UserFixtures constructor.
     * @param UserPasswordEncoderInterface $passwordEncoder
     */
    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {
        $user = new User();
        $user
            ->setEmail('jools@test.com')
            ->setFirstname('Jools')
            ->setSurname('Defly')
            ->setRoles(['ROLE_ADMIN'])
            ->setPassword($this->passwordEncoder->encodePassword($user, 'H3ll0#Th3r3!'))
        ;
        $manager->persist($user);

        $user = new User();
        $user
            ->setEmail('inventory@test.com')
            ->setFirstname('Tester')
            ->setSurname('One')
            ->setRoles(['ROLE_INVENTORY'])
            ->setPassword($this->passwordEncoder->encodePassword($user, 'H3ll0#Th3r3!'))
        ;
        $manager->persist($user);

        $user = new User();
        $user
            ->setEmail('regularuser@test.com')
            ->setFirstname('Tester')
            ->setSurname('Two')
            ->setRoles(['ROLE_USER'])
            ->setPassword($this->passwordEncoder->encodePassword($user, 'H3ll0#Th3r3!'))
        ;
        $manager->persist($user);

        $manager->flush();
    }
}
