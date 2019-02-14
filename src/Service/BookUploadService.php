<?php

namespace App\Service;

use App\DataStructures\UploadStats;
use App\Entity\Book;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final class BookUploadService
{
    /**
     * @var EntityManagerInterface
     */
    private $manager;

    /**
     * @var \Doctrine\Common\Persistence\ObjectRepository
     */
    private $bookRepo;

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
        $this->bookRepo = $this->manager->getRepository(Book::class);
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
        while ($bookDetails = fgetcsv($handle, $length, $delimiter)) {
            if (count($bookDetails) !== 2 || (int)($bookDetails[0]) === 0) {
                continue;
            }

            if ($this->bookExists($bookDetails[0])) {
                $this->stats->addExisting();
                continue;
            }

            $this->addBook($bookDetails);
        }
        $this->manager->flush();
        fclose($handle);

        return $this->stats;
    }

    /**
     * @param int $bookCode
     * @return bool
     */
    private function bookExists(int $bookCode)
    {
        $book = $this->bookRepo->findOneBy(['code' => $bookCode]);

        return !empty($book);
    }

    /**
     * @param $bookDetails
     * @throws \Exception
     */
    private function addBook($bookDetails): void
    {
        $book = new Book();
        $book
            ->setCode($bookDetails[0])
            ->setTitle($bookDetails[1])
            ->setCreatedAt(new \DateTime())
        ;
        $this->manager->persist($book);

        $this->stats->addUploaded();
    }
}
