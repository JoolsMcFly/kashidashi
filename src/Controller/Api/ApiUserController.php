<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Service\BorrowerService;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController
 * @package App\Controller\Api
 * @Route("/api/users")
 */
class ApiUserController extends AbstractController
{

    /**
     * @var SerializerInterface
     */
    private $serializer;

    /**
     * ApiBorrowerController constructor.
     * @param SerializerInterface $serializer
     */
    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }

    /**
     * @Route("", methods={"GET"})
     * @return JsonResponse
     */
    public function list()
    {
        $users = $this->getDoctrine()->getRepository(User::class)->getNonAdminUsers();

        return new JsonResponse($users);
    }
}
