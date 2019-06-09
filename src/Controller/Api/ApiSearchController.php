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
     * @var SerializerInterface
     */
    private $serializer;

    /**
     * @var BookService
     */
    private $bookService;

    /**
     * ApiBorrowerController constructor.
     * @param BorrowerService $borrowerService
     * @param BookService $bookService
     * @param SerializerInterface $serializer
     */
    public function __construct(
        BorrowerService $borrowerService,
        BookService $bookService,
        SerializerInterface $serializer
    ) {
        $this->borrowerService = $borrowerService;
        $this->serializer = $serializer;
        $this->bookService = $bookService;
    }

    /**
     * @Route("/{search}", methods={"GET"})
     * @param string $search
     * @return JsonResponse
     */
    public function search(string $search = '')
    {
        if (is_numeric($search)) {
            $suggestions = $this->bookService->findSuggestions($search);
        } else {
            $suggestions = $this->borrowerService->findSuggestions($search);
        }

        return new JsonResponse($suggestions);
    }
}
