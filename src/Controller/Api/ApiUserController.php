<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

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
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * ApiBorrowerController constructor.
     * @param SerializerInterface $serializer
     * @param UserPasswordEncoderInterface $encoder
     */
    public function __construct(SerializerInterface $serializer, UserPasswordEncoderInterface $encoder)
    {
        $this->serializer = $serializer;
        $this->encoder = $encoder;
    }

    /**
     * @Route("", methods={"GET"})
     * @return JsonResponse
     */
    public function list()
    {
        $users = $this->getDoctrine()->getRepository(User::class)->getNonAdminUsers();

        $context = new SerializationContext();
        $context->setGroups(['list']);
        $users = $this->serializer->serialize($users, 'json', $context);

        return new JsonResponse($users, Response::HTTP_CREATED, [], true);
    }

    /**
     * @Route("", methods={"POST"})
     * @param Request $request
     * @param UserPasswordEncoderInterface $encoder
     * @return JsonResponse
     */
    public function save(Request $request, UserPasswordEncoderInterface $encoder)
    {
        $userId = $request->get('id');
        $userRepository = $this->getDoctrine()->getRepository(User::class);
        if ($userId) {
            $user = $userRepository->find($userId);
            if (!$user) {
                return $this->json('Invalid user ID', Response::HTTP_NOT_FOUND);
            }
        }

        try {
            $user = $userRepository->createUserFromRequest($request);
        } catch (\Exception $e) {
            return $this->json('An error occurred when creating the user.', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $context = new SerializationContext();
        $context->setGroups(['list']);
        $user = $this->serializer->serialize($user, 'json', $context);

        return new JsonResponse($user, Response::HTTP_CREATED, [], true);
    }
}
