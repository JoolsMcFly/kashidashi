<?php

namespace App\Service;

use App\DataStructures\UploadStats;
use App\Entity\Borrower;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final class BorrowerUploadService
{
    /**
     * @var EntityManagerInterface
     */
    private $manager;

    /**
     * @var \Doctrine\Common\Persistence\ObjectRepository
     */
    private $borrowerRepo;

    /**
     * @var UploadStats
     */
    private $stats;

    /**
     * @var ArrayCollection|Borrower[]
     */
    private $borrowers;

    /**
     * UserService constructor.
     * @param EntityManagerInterface $manager
     */
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
        $this->borrowerRepo = $this->manager->getRepository(Borrower::class);
        $this->stats = new UploadStats();
        $this->fetchBorrowers();
    }

    /**
     * @param UploadedFile $file
     * @return UploadStats
     * @throws FileException
     * @throws \Exception
     */
    public function processFile(UploadedFile $file)
    {
        $handle = fopen($file->getPathname(), "r");
        if (!$handle) {
            throw new FileException("Cannot open CSV file.");
        }

        $delimiter = ';';
        $length = 1024;
        fgetcsv($handle, $length, $delimiter);
        while ($borrowerDetails = fgetcsv($handle, $length, $delimiter)) {
            if (count($borrowerDetails) !== 3) {
                continue;
            }

            if ($this->borrowerExists($borrowerDetails)) {
                $this->stats->addExisting();
                continue;
            }

            $this->addBorrower($borrowerDetails);
        }
        $this->manager->flush();
        fclose($handle);

        return $this->stats;
    }

    private function borrowerExists(array $borrower): bool
    {
        if (empty($this->borrowers)) {
            return false;
        }

        foreach ($this->borrowers as $b) {
            if ($b->getSurname() === mb_strtolower($borrower[0])
                && $b->getFrenchSurname() === mb_strtolower($borrower[1])
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param array $borrowerDetails
     * @throws \Exception
     */
    private function addBorrower(array $borrowerDetails): void
    {
        $borrower = new Borrower();
        $borrower
            ->setSurname(mb_strtolower($borrowerDetails[0]))
            ->setFrenchSurname(mb_strtolower($borrowerDetails[1]))
            ->setKatakana($borrowerDetails[2])
            ->setCreatedAt(new \DateTime())
        ;
        $this->manager->persist($borrower);

        $this->stats->addUploaded();
    }

    private function fetchBorrowers()
    {
        $this->borrowers = $this->borrowerRepo->findBy([], ['katakana' => 'asc']);
    }
}
