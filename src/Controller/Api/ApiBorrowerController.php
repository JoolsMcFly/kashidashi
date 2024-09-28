<?php

namespace App\Controller\Api;

use App\Service\BorrowerService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController.
 */
#[Route(path: '/api/borrowers')]
class ApiBorrowerController
{
    private BorrowerService $borrowerService;

    public function __construct(BorrowerService $borrowerService)
    {
        $this->borrowerService = $borrowerService;
    }

    #[Route(path: '/search/{borrowerName}', methods: ['GET'])]
    public function search(string $borrowerName): JsonResponse
    {
        $borrowers = $this->borrowerService->findSuggestions($borrowerName);

        return new JsonResponse($borrowers);
    }
}
