<?php

namespace App\DataFixtures;

use App\Entity\Book;
use App\Entity\Borrower;
use App\Entity\Loan;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;

class LoanFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $books = $manager->getRepository(Book::class)->findBy([], null, 10);
        $borrowers = $manager->getRepository(Borrower::class)->findBy([], null, 10);
        $user = $manager->getRepository(User::class)->findOneBy([]);

        for ($counter = 0; $counter < count($borrowers); $counter++) {
            /** @var Book $book */
            $book = $books[$counter];
            $loan = new Loan();
            $loan->setBook($book)
                ->setBorrower($borrowers[$counter])
                ->setStartedAt(new \DateTime())
                ->setCreator($user)
            ;
            $book->incLoansCount();
            $manager->persist($loan);
            $manager->persist($book);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            UserFixtures::class,
            BooksFixtures::class,
        ];
    }
}
