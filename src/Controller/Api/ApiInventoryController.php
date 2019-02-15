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
class ApiInventoryController extends AbstractController
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
     * @throws \Exception
     */
    public function list()
    {
        $inventories = $this->getDoctrine()->getRepository(Inventory::class)->findBy([],
            ['startedAt' => 'asc', 'stoppedAt' => 'desc'])
        ;

        $context = (new SerializationContext())->setGroups(['details']);

        return new JsonResponse(
            $this->serializer->serialize($inventories, 'json', $context),
            Response::HTTP_CREATED,
            [],
            true
        );
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

            return new JsonResponse(
                $this->serializer->serialize($inventory, 'json', $context),
                Response::HTTP_CREATED,
                [],
                true
            );
        } catch (\Exception $e) {
            return $this->json(null, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/{inventory}/{bookCode}", methods={"PUT"})
     * @param Inventory $inventory
     * @param string $bookCode
     * @return JsonResponse
     */
    public function addBookCode(Inventory $inventory, string $bookCode)
    {
        try {
            $doctrine = $this->getDoctrine();
            $details = $inventory->getDetails();
            $details['returned'][] = $bookCode;
            $inventory
                ->setDetails($details)
                ->increaseBookCount()
            ;
            $manager = $doctrine->getManager();
            $manager->persist($inventory);
            $manager->flush();

            $context = (new SerializationContext())->setGroups(['details']);

            return new JsonResponse(
                $this->serializer->serialize($inventory, 'json', $context),
                Response::HTTP_ACCEPTED,
                [],
                true
            );
        } catch (\Exception $e) {
            return $this->json(null, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/{inventory}", methods={"POST"})
     * @param Inventory $inventory
     * @return JsonResponse
     * @throws \Exception
     */
    public function stop(Inventory $inventory)
    {
        try {
            $inventory->setStoppedAt(new \DateTime());
            $manager = $this->getDoctrine()->getManager();
            $manager->persist($inventory);
            $manager->flush();

            return $this->json(null, Response::HTTP_OK);
        } catch (\Exception $e) {
            file_put_contents('/tmp/debug', "\n\n$e\n", FILE_APPEND);

            return $this->json(null, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
