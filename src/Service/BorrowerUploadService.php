<?php

namespace App\Service;

use App\DataStructures\UploadStats;
use App\Entity\Borrower;
use App\Repository\BorrowerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final class BorrowerUploadService
{
    /**
     * @var EntityManagerInterface
     */
    private $manager;

    /**
     * @var BorrowerRepository
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
     * @throws \Exception
     */
    public function processFile(UploadedFile $file): UploadStats
    {
        $spreadSheet = (new Xlsx())->load($file->getPathname());
        $borrowers = $spreadSheet->getSheet(0)->toArray();
        array_shift($borrowers); // headers
        foreach ($borrowers as $borrower) {
            if (count($borrower) !== 3) {
                continue;
            }
            if ($this->borrowerExists($borrower)) {
                $this->stats->addExisting();
                continue;
            }

            $this->addBorrower($borrower);
        }
        $this->manager->flush();

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
