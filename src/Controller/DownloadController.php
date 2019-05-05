<?php

namespace App\Controller;

use App\Entity\Book;
use App\Service\Export\OverdueLoans;
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
            return new RedirectResponse('/', Response::HTTP_TEMPORARY_REDIRECT);
        }
    }
}
