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
     * @Route("/", methods={"GET"})
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
}
