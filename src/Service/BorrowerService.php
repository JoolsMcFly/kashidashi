<?php

namespace App\Service;

use App\Entity\Borrower;
use Doctrine\ORM\EntityManagerInterface;

final class BorrowerService
{
    /**
     * @var EntityManagerInterface
     */
    private $manager;

    /**
     * UserService constructor.
     * @param EntityManagerInterface $manager
     */
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @return Borrower[]
     */
    public function getBorrowers()
    {
        return $this->manager->getRepository(Borrower::class)->findAll();
    }
}
