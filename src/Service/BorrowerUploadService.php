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
        foreach ($borrowers as $borrowerDetails) {
            if (count($borrowerDetails) !== 4) {
                continue;
            }
            if ($localBorrower = $this->getLocalBorrower($borrowerDetails)) {
                $this->stats->addExisting();
            } else {
                $localBorrower = new Borrower();
                $this->stats->addUploaded();
            }
            $this->updateBorrowerDetails($localBorrower, $borrowerDetails);
        }
        $this->manager->flush();

        return $this->stats;
    }

    private function getLocalBorrower(array $borrower): ?Borrower
    {
        if (empty($this->borrowers)) {
            return null;
        }

        foreach ($this->borrowers as $b) {
            if ($b->getId() === $borrower[0]) {
                return $b;
            }
        }

        return null;
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
        $this->borrowers = $this->borrowerRepo->findBy([], ['katakana' => 'asc']);
    }
}
