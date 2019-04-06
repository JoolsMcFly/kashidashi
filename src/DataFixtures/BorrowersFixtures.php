<?php

namespace App\DataFixtures;

use App\Entity\Borrower;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;

class BorrowersFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('ja_JP');
        for ($i = 0; $i < 300; $i++) {
            $borrower = new Borrower();
            $borrower
                ->setFirstname($faker->firstKanaName)
                ->setSurname($faker->lastKanaName)
            ;
            $manager->persist($borrower);
        }

        $manager->flush();
    }
}
