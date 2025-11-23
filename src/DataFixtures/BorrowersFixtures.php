<?php

namespace App\DataFixtures;

use App\Entity\Borrower;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;

class BorrowersFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('ja_JP');
        for ($i = 0; $i < 300; $i++) {
            $borrower = new Borrower();
            $borrower
                ->setFirstname($faker->firstName)
                ->setSurname($faker->lastName)
                ->setKatakana($faker->lastKanaName)
                ->setFrenchSurname($faker->firstName)
            ;
            $manager->persist($borrower);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            UserFixtures::class,
        ];
    }
}
