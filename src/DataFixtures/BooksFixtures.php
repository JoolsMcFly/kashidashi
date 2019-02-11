<?php

namespace App\DataFixtures;

use App\Entity\Book;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;

class BooksFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('ja_JP');
        for ($i = 0; $i < 800; $i++) {
            $book = new Book();
            $book
                ->setTitle($faker->sentence)
                ->setCode($faker->numberBetween(100, 4800))
            ;
            $manager->persist($book);
        }

        $manager->flush();
    }
}
