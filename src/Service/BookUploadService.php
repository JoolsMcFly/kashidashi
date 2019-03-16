<?php

namespace App\Service;

use App\DataStructures\UploadStats;
use App\Entity\Book;
use App\Entity\Location;
use App\Repository\BookRepository;
use App\Repository\LocationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final class BookUploadService
{
    /**
     * @var EntityManagerInterface
     */
    private $manager;

    /**
     * @var BookRepository
     */
    private $bookRepo;

    /**
     * @var UploadStats
     */
    private $stats;

    /**
     * @var Location[]
     */
    private $locations = [];

    /**
     * @var LocationRepository
     */
    private $locationRepo;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var Book[]
     */
    private $books;

    /**
     * UserService constructor.
     * @param EntityManagerInterface $manager
     * @param LoggerInterface $logger
     */
    public function __construct(EntityManagerInterface $manager, LoggerInterface $logger)
    {
        $this->manager = $manager;
        $this->bookRepo = $this->manager->getRepository(Book::class);
        $this->locationRepo = $this->manager->getRepository(Location::class);
        $this->stats = new UploadStats();
        $this->logger = $logger;
    }

    /**
     * @param UploadedFile $file
     * @param bool $removeNotInList
     * @return UploadStats
     */
    public function processFile(UploadedFile $file, bool $removeNotInList = false)
    {
        $this->loadAllBooks();
        $uploadedBookCodes = [];
        try {
            $handle = fopen($file->getPathname(), "r");
            if (!$handle) {
                throw new FileException("Cannot open CSV file.");
            }
            $delimiter = ',';
            $length = 1024;
            while ($bookDetails = fgetcsv($handle, $length, $delimiter)) {
                if ((int)($bookDetails[0]) === 0 || empty($bookDetails[2])) {
                    continue;
                }

                $uploadedBookCodes[] = $bookDetails[0];
                $book = $this->findOrCreateBook($bookDetails[0]);
                $this->updateBookDetails($bookDetails, $book);
                $this->manager->persist($book);
            }

            if ($removeNotInList) {
                $this->bookRepo->removeNotInCodeList($uploadedBookCodes);
            }
            $this->manager->flush();
        } catch (\Exception $e) {
            $this->logger->error("Error uploading book file\n$e\n\n");
        }
        if ($handle) {
            fclose($handle);
        }

        return $this->stats;
    }

    /**
     * @param int $bookCode
     * @return Book
     * @throws \Exception
     */
    private function findOrCreateBook(int $bookCode): Book
    {
        if (isset($this->books[$bookCode])) {
            return $this->books[$bookCode];
        }

        $book = new Book();
        $book->setCreatedAt(new \DateTime());

        return $book;
    }

    /**
     * @param array $bookDetails
     * @param Book $book
     * @throws \Exception
     */
    private function updateBookDetails(array $bookDetails, Book $book): void
    {
        $location = $this->getLocation($bookDetails[1]);
        $book
            ->setCode($bookDetails[0])
            ->setLocation($location)
            ->setTitle($bookDetails[2])
        ;
        $this->manager->persist($book);

        $this->stats->addUploaded();
    }

    /**
     * @param string $location
     * @return Location
     * @throws \Exception
     */
    private function getLocation(string $location)
    {
        $location = trim($location);
        if (empty($location)) {
            return null;
        }
        if (!isset($this->locations[$location])) {
            $this->locations[$location] = $this->findOrCreateLocationByName($location);
        }

        return $this->locations[$location];
    }

    /**
     * @param string $locationName
     * @return Location
     * @throws \Exception
     */
    private function findOrCreateLocationByName(string $locationName)
    {
        if ($location = $this->locationRepo->findOneByName($locationName)) {
            return $location;
        }

        $location = new Location();
        $location
            ->setName($locationName)
            ->setCreatedAt(new \DateTime())
        ;

        $this->manager->persist($location);

        return $location;
    }

    private function loadAllBooks()
    {
        $this->books = $this->bookRepo->groupByCode();
    }
}
