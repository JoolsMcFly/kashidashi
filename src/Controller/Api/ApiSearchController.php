<?php

namespace App\Controller\Api;

use App\Service\BookService;
use App\Service\BorrowerService;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController
 * @package App\Controller\Api
 * @Route("/api/search")
 */
class ApiSearchController
{
    /**
     * @var BorrowerService
     */
    private $borrowerService;

    /**
     * @var BookService
     */
    private $bookService;

    public function __construct(
        BorrowerService $borrowerService,
        BookService $bookService
    ) {
        $this->borrowerService = $borrowerService;
        $this->bookService = $bookService;
    }

    /**
     * @Route("/{search}", methods={"GET"})
     */
    public function search(string $search = ''): JsonResponse
    {
        if (is_numeric($search)) {
            $suggestions = $this->bookService->findSuggestions($search);
        } else {
            $suggestions = $this->borrowerService->findSuggestions($search);
        }

        return new JsonResponse($suggestions);
    }
}
