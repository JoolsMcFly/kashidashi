<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityNotFoundException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Class ApiBorrowerController
 * @package App\Controller\Api
 * @Route("/api/users")
 */
class ApiUserController extends AbstractController
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
        $users = $this->getDoctrine()->getRepository(User::class)->getNonAdminUsers();

        $users = $this->serializer->serialize($users, 'json', ['groups' => ['list']]);

        return new JsonResponse($users, Response::HTTP_CREATED, [], true);
    }

    /**
     * @Route("", methods={"POST"})
     */
    public function save(Request $request): JsonResponse
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

        $user = $this->serializer->serialize($user, 'json', ['groups' => ['list']]);

        return new JsonResponse($user, Response::HTTP_CREATED, [], true);
    }

    /**
     * @Route("/{id}", methods={"DELETE"}, requirements={"id"="\d+"})
     */
    public function delete(User $user): JsonResponse
    {
        if (!$this->getUser()->isAdmin() && $user->isAdmin()) {
            return $this->json('Insufficient privileges to delete this user.', Response::HTTP_FORBIDDEN);
        }

        $manager = $this->getDoctrine()->getManager();
        $manager->remove($user);
        $manager->flush();

        return $this->json('User successfully deleted.', Response::HTTP_OK);
    }
}
