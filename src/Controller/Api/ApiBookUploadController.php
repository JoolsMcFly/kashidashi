<?php

namespace App\Controller\Api;

use App\Entity\Book;
use App\Service\BookUploadService;
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
class ApiBookUploadController extends AbstractController
{
    /**
     * @Route("/api/books-upload", methods={"POST"})
     * @param Request $request
     * @param BookUploadService $bookUploadService
     * @return JsonResponse
     */
    public function list(Request $request, BookUploadService $bookUploadService)
    {
        foreach ($request->files as $file) {
            try {
                $bookUploadService->processFile($file);

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
