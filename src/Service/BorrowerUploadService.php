<?php

namespace App\Service;

use App\DataStructures\UploadStats;
use App\Entity\Borrower;
use App\Repository\BorrowerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;

final class BorrowerUploadService
{
    private EntityManagerInterface $manager;

    /**
     * @var BorrowerRepository
     */
    private $borrowerRepo;

    /**
     * @var UploadStats
     */
    private UploadStats $stats;

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
    public function processFile(string $filename): UploadStats
    {
        $spreadSheet = (new Xlsx())->load($filename);
        $borrowers = $spreadSheet->getSheet(0)->toArray();
        array_shift($borrowers); // headers
        foreach ($borrowers as $borrowerDetails) {
            if (count($borrowerDetails) !== 4) {
                continue;
            }
            $borrower = $this->findOrCreateBorrower($borrowerDetails);
            $this->updateBorrowerDetails($borrower, $borrowerDetails);
        }
        $this->manager->flush();

        return $this->stats;
    }

    private function getLocalBorrower(int $borrowerId): ?Borrower
    {
        if (empty($this->borrowers) || !isset($this->borrowers[$borrowerId])) {
            return null;
        }

        return $this->borrowers[$borrowerId];
    }

    /**
     * @throws \Exception
     */
    private function updateBorrowerDetails(Borrower $borrower, array $borrowerDetails): void
    {
        $borrower
            ->setSurname(mb_strtolower($borrowerDetails[1]))
            ->setFrenchSurname(mb_strtolower($borrowerDetails[2]))
            ->setKatakana($borrowerDetails[3])
            ->setCreatedAt(new \DateTime())
        ;
        $this->manager->persist($borrower);
    }

    private function fetchBorrowers()
    {
        $this->borrowers = $this->borrowerRepo->getAll();
    }

    private function findOrCreateBorrower(array $borrowerDetails): Borrower
    {
        $id = $borrowerDetails[0];
        if (!empty($id) && $borrower = $this->getLocalBorrower($id)) {
            $this->stats->addExisting();
        } else {
            $borrower = new Borrower();
            $this->stats->addUploaded();
        }

        return $borrower;
    }
}
