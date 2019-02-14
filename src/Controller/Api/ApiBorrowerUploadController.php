<?php

namespace App\Controller\Api;

use App\Service\BorrowerUploadService;
use App\Service\UserUploadService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
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
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function list(Request $request, BorrowerUploadService $userUploadService)
    {
        foreach ($request->files as $file) {
            try {
                $userUploadService->processFile($file);

                return $this->json(null);
            } catch (FileException $e) {
                return $this->json(
                    'Error reading uploaded file.',
                    Response::HTTP_INTERNAL_SERVER_ERROR
                );
            } catch (\Exception $e) {
                return $this->json(
                    'An error has occurred when processing your file.',
                    Response::HTTP_INTERNAL_SERVER_ERROR
                );
            }
        }

    }
}
