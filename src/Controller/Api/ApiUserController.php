<?php

namespace App\Controller\Api;

use App\Entity\User;
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
     * @return JsonResponse
     */
    public function save(Request $request)
    {
        $user = new User();
        $user
            ->setFirstname($request->get('firstname'))
            ->setSurname($request->get('surname'))
            ->setEmail($request->get('email'))
            ->setPassword($request->get('password'))
        ;
        $manager = $this->getDoctrine()->getManager();
        $manager->persist($user);
        $manager->flush();

        return new JsonResponse($user);
    }
}
