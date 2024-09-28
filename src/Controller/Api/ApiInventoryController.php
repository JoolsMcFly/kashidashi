<?php

namespace App\Controller\Api;

use _Entity\Inventory;
use _Entity\InventoryItem;
use _Entity\User;
use App\Repository\BookRepository;
use App\Repository\InventoryItemRepository;
use App\Repository\InventoryRepository;
use DateTime;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController.
 */
#[Route(path: '/api/inventory')]
class ApiInventoryController extends ApiBaseController
{
    #[Route(path: '', methods: ['GET'], name: 'inventories')]
    public function list(InventoryRepository $inventoryRepository): JsonResponse
    {
        $inventories = $inventoryRepository->findBy(
            [],
            ['startedAt' => 'desc', 'stoppedAt' => 'asc']
        );

        return new JsonResponse($this->serialize($inventories, ['groups' => ['details']], 'Y-m-d H:i:s'), Response::HTTP_CREATED, [], true);
    }

    #[Route(path: '/{inventory}/details', methods: ['GET'], requirements: ['inventory' => '\d+'], name: 'inventory_details')]
    public function details(Inventory $inventory, InventoryItemRepository $itemRepository, BookRepository $bookRepository): JsonResponse
    {
        $details = [
            'to_move' => $itemRepository->countBooksToMove($inventory),
            'missing' => $bookRepository->countBooksNotInInventory($inventory),
        ];

        return new JsonResponse(json_encode($details), Response::HTTP_OK, [], true);
    }

    #[Route(path: '', methods: ['POST'], name: 'inventory_create')]
    public function create(BookRepository $bookRepository): JsonResponse
    {
        try {
            $bookCount = $bookRepository->getTotalBookCount();
            $inventory = new Inventory();
            $inventory
                ->setStartedAt(new DateTime())
                ->setAvailableBookCount($bookCount)
            ;
            $this->entityManager->persist($inventory);
            $this->entityManager->flush();

            return new JsonResponse($this->serialize($inventory, ['groups' => ['details']]), Response::HTTP_CREATED, [], true);
        } catch (Exception $e) {
            return $this->json(null, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route(path: '/{inventory}/{bookCode}', methods: ['PUT'], requirements: ['inventory' => '\d+', 'bookCode' => '\d+'], name: 'inventory_add_book')]
    public function addBookCode(
        BookRepository $bookRepository,
        InventoryItemRepository $itemRepository,
        Inventory $inventory,
        string $bookCode,
    ): JsonResponse {
        try {
            $book = $bookRepository->getBookWithCurrentLoan($bookCode);
            if (!$book) {
                return $this->json("Book code '$bookCode' doesn't exist.", Response::HTTP_BAD_REQUEST);
            }

            if ($itemRepository->isCodeAlreadyAdded($inventory, $bookCode)) {
                return $this->json("Book code '$bookCode' already added.", Response::HTTP_BAD_REQUEST);
            }

            $inventory->increaseBookCount();
            $inventoryItem = new InventoryItem();
            /** @var User $user */
            $user = $this->getUser();
            $inventoryItem
                ->setFoundAt($user->getLocation())
                ->setBelongsAt($book->getLocation())
                ->setBook($book)
                ->setInventory($inventory)
            ;
            $this->entityManager->persist($inventory);
            $this->entityManager->persist($inventoryItem);
            $this->entityManager->flush();

            $loan = $book->getLoans()->first();
            if ($loan) {
                $borrowerName = $loan->getBorrower()->getFullName();
            } else {
                $borrowerName = null;
            }

            $responseData = [
                'inventory' => json_decode(
                    $this->serialize($inventory, ['groups' => ['details']]), true
                ),
                'book' => json_decode(
                    $this->serialize($book, ['groups' => ['basic']]), true
                ),
                'inventory_item' => json_decode(
                    $this->serialize($inventoryItem, ['groups' => ['basic']]), true
                ),
                'books_to_move' => $itemRepository->getItemsToMove($inventory, $user->getLocation()),
                'borrowed_by' => $borrowerName,
            ];

            return $this->json($responseData, Response::HTTP_ACCEPTED);
        } catch (Exception $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route(path: '/{inventory}/{bookCode}', methods: ['DELETE'], requirements: ['inventory' => '\d+', 'bookCode' => '\d+'], name: 'inventory_remove_book')]
    public function removeBook(Inventory $inventory, string $bookCode, InventoryItemRepository $itemRepository): JsonResponse
    {
        if ($itemRepository->removeCode($inventory, $bookCode)) {
            $inventory->decreaseBookCount();
            $this->entityManager->persist($inventory);
            $this->entityManager->flush();
        }

        return $this->json([
            'inventory' => json_decode($this->serialize($inventory, ['groups' => ['details']]), true),
            'books_to_move' => $itemRepository->getItemsToMove($inventory, $this->getUser()->getLocation()),
        ], Response::HTTP_ACCEPTED);
    }

    #[Route(path: '/{inventory}', methods: ['POST'], name: 'inventory_close')]
    public function close(Inventory $inventory): JsonResponse
    {
        try {
            $inventory->setStoppedAt(new DateTime());
            $this->entityManager->persist($inventory);
            $this->entityManager->flush();

            return $this->json(null, Response::HTTP_OK);
        } catch (Exception $e) {
            return $this->json(null, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
