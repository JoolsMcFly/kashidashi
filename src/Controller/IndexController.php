<?php

namespace App\Controller;

use App\Repository\InventoryItemRepository;
use App\Repository\InventoryRepository;
use App\Repository\LocationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

final class IndexController extends AbstractController
{
    /**
     * @Route("/{vueRouting}", requirements={"vueRouting"="^(?!api|_(profiler|wdt)).*"}, name="index")
     */
    public function indexAction(
        InventoryRepository $inventoryRepository,
        InventoryItemRepository $inventoryItemRepository,
        LocationRepository $locationRepository,
        SerializerInterface $serializer
    ): Response {
        $user = $this->getUser();
        $userLocation = $user ? $user->getLocation() : null;

        $inventoryDetails = null;
        $inventory = $inventoryRepository->getOpenInventory();
        if ($inventory) {
            $inventoryDetails = $serializer->serialize($inventory, 'json', ['groups' => ['details']]);
            $booksToMove = $inventoryItemRepository->getItemsToMove($inventory, $userLocation);
        }

        if ($userLocation) {
            $userLocation = [
                'id' => $userLocation->getId(),
                'name' => $userLocation->getName(),
            ];
        }
        return $this->render('base.html.twig', [
            'isAuthenticated' => json_encode(!empty($user)),
            'roles' => json_encode(!empty($user) ? $user->getRoles() : []),
            'activeInventory' => $inventoryDetails,
            'locations' => $serializer->serialize($locationRepository->findAll(), 'json', ['groups' => ['basic']]),
            'userLocation' => json_encode($userLocation ?? null),
            'booksToMove' => json_encode($booksToMove ?? []),
        ]);
    }
}
