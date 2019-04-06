<?php

namespace App\Controller\Api;

use App\Entity\Book;
use App\Entity\Inventory;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController
 * @package App\Controller\Api
 * @Route("/api/inventory")
 */
class ApiInventoryController extends ApiBaseController
{
    /**
     * @Route("", methods={"GET"})
     * @return JsonResponse
     * @throws \Exception
     */
    public function list()
    {
        $inventories = $this->getDoctrine()->getRepository(Inventory::class)->findBy([],
            ['startedAt' => 'desc', 'stoppedAt' => 'asc'])
        ;

        $context = (new SerializationContext())->setGroups(['details']);

        return new JsonResponse($this->serialize($inventories, $context), Response::HTTP_CREATED, [], true);
    }

    /**
     * @Route("/{inventory}/missing-books", methods={"GET"}, requirements={"inventory"="\d+"})
     * @param Inventory $inventory
     * @return JsonResponse
     */
    public function getMissingBooks(Inventory $inventory)
    {
        $books = $this->getDoctrine()->getRepository(Book::class)->getMissingBooks($inventory->getDetails()['missing']);
        $context = (new SerializationContext())->setGroups(['details']);

        return new JsonResponse($this->serialize($books, $context), Response::HTTP_OK, [], true);
    }

    /**
     * @Route("", methods={"POST"})
     * @return JsonResponse
     * @throws \Exception
     */
    public function create()
    {
        try {
            $doctrine = $this->getDoctrine();
            $manager = $doctrine->getManager();
            $bookCount = $doctrine->getRepository(Book::class)->getCount();
            $inventory = new Inventory();
            $inventory
                ->setStartedAt(new \DateTime())
                ->setAvailableBookCount($bookCount)
            ;
            $manager->persist($inventory);
            $manager->flush();
            $context = (new SerializationContext())->setGroups(['details']);

            return new JsonResponse($this->serialize($inventory, $context), Response::HTTP_CREATED, [], true);
        } catch (\Exception $e) {
            return $this->json(null, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/{inventory}/{bookCode}", methods={"PUT"}, requirements={"inventory"="\d+", "bookCode"="\d+"})
     * @param Inventory $inventory
     * @param string $bookCode
     * @return JsonResponse
     */
    public function addBookCode(Inventory $inventory, string $bookCode)
    {
        try {
            $doctrine = $this->getDoctrine();
            $book = $doctrine->getRepository(Book::class)->findOneBy(['code' => $bookCode]);
            if (!$book) {
                return $this->json("Book code '$bookCode' doesn't exist.", Response::HTTP_BAD_REQUEST);
            }

            $details = $inventory->getDetails();
            if (in_array($bookCode, $details['returned'])) {
                return $this->json("Book code '$bookCode' already added..", Response::HTTP_BAD_REQUEST);
            }

            $details['returned'][] = $bookCode;
            $inventory
                ->setDetails($details)
                ->increaseBookCount()
            ;
            $manager = $doctrine->getManager();
            $manager->persist($inventory);
            $manager->flush();

            $context = (new SerializationContext())->setGroups(['details']);

            $responseData = [
                'inventory' => json_decode($this->serialize($inventory, $context)),
                'book' => json_decode(
                    $this->serialize($book, (new SerializationContext())->setGroups(['basic']))
                ),
            ];

            return $this->json($responseData, Response::HTTP_ACCEPTED);
        } catch (\Exception $e) {
            return $this->json(null, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/{inventory}/{bookCode}", methods={"DELETE"}, requirements={"inventory"="\d+", "bookCode"="\d+"})
     * @param Inventory $inventory
     * @param string $bookCode
     * @return JsonResponse
     */
    public function removeBook(Inventory $inventory, string $bookCode)
    {
        $details = $inventory->getDetails();
        $bookPos = array_search($bookCode, $details['returned']);
        if ($bookPos) {
            unset($details['returned'][$bookPos]);
            $inventory
                ->setDetails($details)
                ->decreaseBookCount()
            ;
            $manager = $this->getDoctrine()->getManager();
            $manager->persist($inventory);
            $manager->flush();
        }

        $context = (new SerializationContext())->setGroups(['details']);

        return new JsonResponse($this->serialize($inventory, $context), Response::HTTP_ACCEPTED, [], true);
    }

    /**
     * @Route("/{inventory}", methods={"POST"})
     * @param Inventory $inventory
     * @return JsonResponse
     * @throws \Exception
     */
    public function close(Inventory $inventory)
    {
        try {
            $doctrine = $this->getDoctrine();
            $inventory->setStoppedAt(new \DateTime());
            $details = $inventory->getDetails();
            $missingBookids = $doctrine->getRepository(Book::class)->findNotIn($details['returned'] ?? []);
            $details['missing'] = $missingBookids;
            $inventory->setDetails($details);

            $manager = $doctrine->getManager();
            $manager->persist($inventory);
            $manager->flush();

            return $this->json(null, Response::HTTP_OK);
        } catch (\Exception $e) {
            file_put_contents('/tmp/debug', "\n\n$e\n", FILE_APPEND);

            return $this->json(null, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
