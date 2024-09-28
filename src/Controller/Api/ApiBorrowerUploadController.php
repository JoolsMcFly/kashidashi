<?php

namespace App\Controller\Api;

use App\Service\BorrowerUploadService;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController.
 */
class ApiBorrowerUploadController extends AbstractController
{
    #[Route(path: '/api/borrowers-upload', methods: ['POST'])]
    public function upload(Request $request, BorrowerUploadService $userUploadService): JsonResponse
    {
        $user = $this->getUser();
        foreach ($request->files as $file) {
            try {
                $stats = $userUploadService->processFile($file);

                return $this->json(['message' => $stats->getChangesReport()]);
            } catch (FileException $e) {
                $error = 'Error reading uploaded file.';
                if ($user->isAdmin()) {
                    $error .= 'fetchDetails<br>'.$e->getMessage().'fetchDetails<br>'.$e->getFile().':'.$e->getLine();
                }

                return $this->json($error, Response::HTTP_INTERNAL_SERVER_ERROR);
            } catch (Exception $e) {
                $error = 'An error has occurred when processing your file.';
                if ($user->isAdmin()) {
                    $error .= 'fetchDetails<br>'.$e->getMessage().'fetchDetails<br>'.$e->getFile().':'.$e->getLine();
                }

                return $this->json($error, Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        return $this->json(null);
    }
}
