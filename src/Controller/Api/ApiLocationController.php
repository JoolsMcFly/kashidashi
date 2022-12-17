<?php

namespace App\Controller\Api;

use App\Entity\Location;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Class ApiBorrowerController
 * @package App\Controller\Api
 * @Route("/api/locations")
 */
class ApiLocationController extends AbstractController
{
    private SerializerInterface $serializer;

    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }

    /**
     * @Route("", methods={"GET"})
     */
    public function list(): JsonResponse
    {
        $locations = $this->getDoctrine()->getRepository(Location::class)->findAll();

        $locations = $this->serializer->serialize($locations, 'json', ['groups' => ['list']]);

        return new JsonResponse($locations, Response::HTTP_CREATED, [], true);
    }
}
