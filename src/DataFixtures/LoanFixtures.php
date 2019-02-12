<?php

namespace App\DataFixtures;

use App\Entity\Book;
use App\Entity\Borrower;
use App\Entity\Loan;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;

class LoanFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $books = $manager->getRepository(Book::class)->findBy([], null, 10);
        $borrowers = $manager->getRepository(Borrower::class)->findBy([], null, 10);

        for ($counter = 0; $counter < count($borrowers); $counter++) {
            $loan = new Loan();
            $loan->setBook($books[$counter])
                ->setBorrower($borrowers[$counter])
                ->setStartedAt(new \DateTime())
            ;
            $manager->persist($loan);
        }

        $manager->flush();
    }
}
