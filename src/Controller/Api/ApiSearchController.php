<?php

namespace App\Controller\Api;

use App\Service\BookService;
use App\Service\BorrowerService;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
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
     * @Route("", methods={"GET"})
     * @return JsonResponse
     */
    public function list()
    {
        $borrowers = $this->borrowerService->getBorrowers();

        $context = (new SerializationContext())->setGroups(['list']);

        return new JsonResponse(
            $this->serializer->serialize($borrowers, 'json', $context),
            Response::HTTP_OK,
            [],
            true
        );
    }

    /**
     * @Route("/{search}", methods={"GET"})
     * @param string $search
     * @return JsonResponse
     */
    public function search($search)
    {
        if (is_numeric($search)) {
            $suggestions = $this->bookService->findSuggestions($search);
        } else {
            $suggestions = $this->borrowerService->findSuggestions($search);
        }

        $context = (new SerializationContext())->setGroups(['details']);

        return new JsonResponse($suggestions);
    }
}
