<?php

namespace App\Controller\Api;

use App\Service\BookUploadService;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController.
 */
class ApiBookUploadController extends AbstractController
{
    #[Route(path: '/api/books-upload', methods: ['POST'])]
    public function upload(Request $request, BookUploadService $bookUploadService): JsonResponse
    {
        /** @var UploadedFile $file */
        foreach ($request->files as $file) {
            try {
                $stats = $bookUploadService->processFile($file->getPathname());

                return $this->json(['message' => $stats->getChangesReport()]);
            } catch (FileException $e) {
                $error = 'Error reading uploaded file.';
                if ($this->getUser()->isAdmin()) {
                    $error .= 'fetchDetails<br>'.$e->getMessage().'fetchDetails<br>'.$e->getFile().':'.$e->getLine();
                }

                return $this->json(
                    $error,
                    Response::HTTP_INTERNAL_SERVER_ERROR
                );
            } catch (Exception $e) {
                $error = 'An error has occurred when processing your file.';
                if ($this->getUser()->isAdmin()) {
                    $error .= 'fetchDetails<br>'.$e->getMessage().'fetchDetails<br>'.$e->getFile().':'.$e->getLine();
                }

                return $this->json($error, Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        return $this->json(null);
    }
}
