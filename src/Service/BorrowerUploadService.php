<?php

namespace App\Service;

use App\DataStructures\UploadStats;
use App\Entity\Borrower;
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
     * UserService constructor.
     * @param EntityManagerInterface $manager
     */
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
        $this->borrowerRepo = $this->manager->getRepository(Borrower::class);
        $this->stats = new UploadStats();
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
        $headers = fgetcsv($handle, $length, $delimiter);
        while ($borrowerDetails = fgetcsv($handle, $length, $delimiter)) {
            if (count($borrowerDetails) !== 2) {
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

    /**
     * @param array $borrower
     * @return bool
     */
    private function borrowerExists(array $borrower)
    {
        $borrower = $this->borrowerRepo->findOneBy([
            'surname' => $borrower[0],
            'firstname' => $borrower[1],
        ]);

        return !empty($borrower);
    }

    /**
     * @param array $borrowerDetails
     * @throws \Exception
     */
    private function addBorrower(array $borrowerDetails): void
    {
        $borrower = new Borrower();
        $borrower
            ->setFirstname($borrowerDetails[0])
            ->setSurname($borrowerDetails[1])
            ->setCreatedAt(new \DateTime())
        ;
        $this->manager->persist($borrower);

        $this->stats->addUploaded();
    }
}
