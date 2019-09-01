<?php

namespace App\Controller\Api;

use App\Service\BorrowerUploadService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController
 * @package App\Controller\Api
 */
class ApiBorrowerUploadController extends AbstractController
{
    /**
     * @Route("/api/borrowers-upload", methods={"POST"})
     * @param Request $request
     * @param BorrowerUploadService $userUploadService
     * @return JsonResponse
     */
    public function list(Request $request, BorrowerUploadService $userUploadService)
    {
        $user = $this->getUser();
        foreach ($request->files as $file) {
            try {
                $stats = $userUploadService->processFile($file);

                return $this->json(['message' => $stats->getChangesReport()]);
            } catch (FileException $e) {
                $error = 'Error reading uploaded file.';
                if ($user->isAdmin()) {
                    $error .= "<br />" . $e->getMessage() . "<br />" . $e->getFile() . ':' . $e->getLine();
                }

                return $this->json($error, Response::HTTP_INTERNAL_SERVER_ERROR);
            } catch (\Exception $e) {
                $error = 'An error has occurred when processing your file.';
                if ($user->isAdmin()) {
                    $error .= "<br />" . $e->getMessage() . "<br />" . $e->getFile() . ':' . $e->getLine();
                }

                return $this->json($error, Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }
    }
}
