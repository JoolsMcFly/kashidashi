<?php

namespace App\DataFixtures;

use App\Entity\Location;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;

class LocationFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('en_GB');
        for ($i = 0; $i < 5; $i++) {
            $location = new Location();
            $location->setName($faker->city);
            $manager->persist($location);
        }

        $manager->flush();
    }
}
