<?php

namespace App\Controller\Api;

use App\Service\BorrowerService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController
 * @package App\Controller\Api
 * @Route("/api/borrowers")
 */
class ApiBorrowerController
{
    private BorrowerService $borrowerService;

    public function __construct(BorrowerService $borrowerService)
    {
        $this->borrowerService = $borrowerService;
    }

    /**
     * @Route("/search/{borrowerName}", methods={"GET"})
     */
    public function search(string $borrowerName): JsonResponse
    {
        $borrowers = $this->borrowerService->findSuggestions($borrowerName);

        return new JsonResponse($borrowers);
    }
}
