<?php

namespace App\Controller\Api;

use App\Service\BookService;
use App\Service\BorrowerService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController.
 */
#[Route(path: '/api/search')]
class ApiSearchController
{
    #[Route(path: '/{search}', methods: ['GET'])]
    public function search(BorrowerService $borrowerService, BookService $bookService, string $search = ''): JsonResponse
    {
        if (is_numeric($search)) {
            $suggestions = $bookService->findSuggestions($search);
        } else {
            $suggestions = $borrowerService->findSuggestions($search);
        }

        return new JsonResponse($suggestions);
    }
}
