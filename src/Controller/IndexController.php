<?php

namespace App\Controller;

use App\Entity\Book;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

final class IndexController extends AbstractController
{
    /**
     * @Route("/{vueRouting}", requirements={"vueRouting"="^(?!api|_(profiler|wdt)).*"}, name="index")
     * @return Response
     */
    public function indexAction(): Response
    {
        $user = $this->getUser();

        return $this->render('base.html.twig', [
            'isAuthenticated' => json_encode(!empty($user)),
            'roles' => json_encode(!empty($user) ? $user->getRoles() : []),
        ]);
    }
}
