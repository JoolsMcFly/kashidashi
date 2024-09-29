<?php

namespace App\Controller\Api;

use _Entity\User;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

final class ApiSecurityController extends AbstractController
{
    #[Route(path: '/api/security/login', name: 'login')]
    public function login(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        return new JsonResponse($user->getRoles());
    }

    /**
     * @throws RuntimeException
     */
    #[Route(path: '/api/security/logout', name: 'logout')]
    public function logout(): void
    {
        throw new RuntimeException('This should not be reached!');
    }
}
