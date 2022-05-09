<?php

namespace App\Controller;

use App\Entity\Book;
use App\Entity\Location;
use App\Service\Export\Books;
use App\Service\Export\Borrowers;
use App\Service\Export\OverdueLoans;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/download")
 */
final class DownloadController extends AbstractController
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * @Route("/overdue-loans", name="overdue_loans_download")
     * @param OverdueLoans $loansExport
     * @return Response
     */
    public function downloadOverdueLoans(OverdueLoans $loansExport): Response
    {
        try {
            $filename = $loansExport->export();

            $fileResponse = new BinaryFileResponse($filename);
            $fileResponse->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, basename($filename));

            return $fileResponse;
        } catch (\Exception $exception) {
            $this->logger->error("Error downloading overdue loans:\n\n$exception\n\n\n");

            return new RedirectResponse('/', Response::HTTP_TEMPORARY_REDIRECT);
        }
    }

    /**
     * @Route("/borrowers", name="borrowers_download")
     */
    public function downloadBorrowers(Borrowers $borrowers): Response
    {
        try {
            $filename = $borrowers->export();

            $fileResponse = new BinaryFileResponse($filename);
            $fileResponse->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, basename($filename));

            return $fileResponse;
        } catch (\Exception $exception) {
            $this->logger->error("Error downloading borrowers:\n\n$exception\n\n\n");

            return new RedirectResponse('/', Response::HTTP_TEMPORARY_REDIRECT);
        }
    }

    /**
     * @Route("/books", name="books")
     */
    public function downloadBooks(Books $books): Response
    {
        try {
            $filename = $books->export();

            $fileResponse = new BinaryFileResponse($filename);
            $fileResponse->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, basename($filename));

            return $fileResponse;
        } catch (\Exception $exception) {
            $this->logger->error("Error downloading books:\n\n$exception\n\n\n");

            return new RedirectResponse('/', Response::HTTP_TEMPORARY_REDIRECT);
        }
    }

    /**
     * @Route("/books-by-location/{location}", name="books-by-location")
     */
    public function downloadBooksByLocation(Books $books, Location $location = null): Response
    {
        try {
            $filename = $books->export($location);

            $fileResponse = new BinaryFileResponse($filename);
            $fileResponse->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, basename($filename));

            return $fileResponse;
        } catch (\Exception $exception) {
            $this->logger->error("Error downloading books:\n\n$exception\n\n\n");

            return new RedirectResponse('/', Response::HTTP_TEMPORARY_REDIRECT);
        }
    }
}
