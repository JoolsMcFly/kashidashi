<?php

namespace App\Service;

use App\DataStructures\UploadStats;
use App\Entity\Book;
use App\Entity\Location;
use App\Repository\BookRepository;
use App\Repository\LocationRepository;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use Psr\Log\LoggerInterface;

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
     * @throws \Exception
     */
    public function processFile(string $pathName): UploadStats
    {
        $this->loadAllBooks();
        $spreadSheet = (new Xlsx())->load($pathName);
        $books = $spreadSheet->getSheet(0)->toArray();
        array_shift($books); // headers
        foreach ($books as $bookDetails) {
            if (empty($bookDetails[0])) {
                continue;
            }
            $book = $this->findOrCreateBook((int)$bookDetails[0]);
            $this->updateBookDetails($bookDetails, $book);
            $this->manager->persist($book);
        }

        try {
            $this->manager->flush();
        } catch (\Exception $e) {
            $this->logger->error("Error uploading book file\n$e\n\n");
        }

        return $this->stats;
    }

    /**
     * @throws \Exception
     */
    private function findOrCreateBook(int $id): Book
    {
        if (isset($this->books[$id])) {
            $this->stats->addExisting();

            return $this->books[$id];
        }

        $book = new Book();
        $book->setCreatedAt(new \DateTime());

        $this->stats->addUploaded();

        return $book;
    }

    /**
     * @throws \Exception
     */
    private function updateBookDetails(array $bookDetails, Book $book): void
    {
        $book
            ->setCode($bookDetails[0])
            ->setTitle($bookDetails[1])
            ->setLocation($this->getLocation($bookDetails[2]))
        ;
        $this->manager->persist($book);
    }

    /**
     * @throws \Exception
     */
    private function getLocation(?string $location): ?Location
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
     * @throws \Exception
     */
    private function findOrCreateLocationByName(string $locationName): Location
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
        $this->books = $this->bookRepo->indexByCode();
    }
}
