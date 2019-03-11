<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityNotFoundException;
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
        $userRepository = $this->getDoctrine()->getRepository(User::class);
        try {
            $user = $userRepository->createUserFromRequest($request);
        } catch (EntityNotFoundException $e) {
            return $this->json('Unknown user.', Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (UniqueConstraintViolationException $e) {
            return $this->json('A user with the same email already exists.', Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return $this->json('An error occurred when creating the user.', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $context = new SerializationContext();
        $context->setGroups(['list']);
        $user = $this->serializer->serialize($user, 'json', $context);

        return new JsonResponse($user, Response::HTTP_CREATED, [], true);
    }

    /**
     * @Route("/{id}", methods={"DELETE"}, requirements={"id"="\d+"})
     * @param User $user
     * @return JsonResponse
     */
    public function delete(User $user)
    {
        $manager = $this->getDoctrine()->getManager();
        $manager->remove($user);
        $manager->flush();

        return $this->json('User successfully deleted.', Response::HTTP_OK);
    }
}
