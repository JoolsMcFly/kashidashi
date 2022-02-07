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
     * @throws \Exception
     */
    public function processFile(UploadedFile $file, bool $removeNotInList = false)
    {
        $this->loadAllBooks();
        $uploadedBookCodes = [];
        $spreadSheet = (new Xlsx())->load($file->getPathname());
        $books = $spreadSheet->getSheet(0)->toArray();
        array_shift($books); // headers
        foreach ($books as $bookDetails) {
            if (count($bookDetails) !== 3) {
                continue;
            }
            $uploadedBookCodes[] = $bookDetails[0];
            $book = $this->findOrCreateBook((int) $bookDetails[0]);
            $this->updateBookDetails($bookDetails, $book);
            $this->manager->persist($book);
        }

        try {
            $this->manager->flush();
        } catch (\Exception $e) {
            $this->logger->error("Error uploading book file\n$e\n\n");
        }
        if ($removeNotInList) {
            try {
                $this->bookRepo->removeNotInCodeList($uploadedBookCodes);
            } catch (\Exception $e) {
                $this->logger->error("Error removing books\n$e\n\n");
            }
        }

        return $this->stats;
    }

    /**
     * @throws \Exception
     */
    private function findOrCreateBook(int $bookCode): Book
    {
        if (isset($this->books[$bookCode])) {
            $this->stats->addExisting();

            return $this->books[$bookCode];
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
            ->setLocation($this->getLocation($bookDetails[2]))
            ->setTitle($bookDetails[1])
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
