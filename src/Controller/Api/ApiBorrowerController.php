<?php

namespace App\Controller\Api;

use App\Service\BorrowerService;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController
 * @package App\Controller\Api
 * @Route("/api/borrowers")
 */
class ApiBorrowerController
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
     * ApiBorrowerController constructor.
     * @param BorrowerService $borrowerService
     * @param SerializerInterface $serializer
     */
    public function __construct(BorrowerService $borrowerService, SerializerInterface $serializer)
    {
        $this->borrowerService = $borrowerService;
        $this->serializer = $serializer;
    }

    /**
     * @Route("/search/{borrowerName}", methods={"GET"})
     * @param string $borrowerName
     * @return JsonResponse
     */
    public function search(string $borrowerName)
    {
        $borrowers = $this->borrowerService->findSuggestions($borrowerName);

        return new JsonResponse($borrowers);
    }
}
