<?php

namespace App\Controller\Api;

use App\Entity\Book;
use App\Entity\Location;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityNotFoundException;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ApiBorrowerController
 * @package App\Controller\Api
 * @Route("/api/locations")
 */
class ApiLocationController extends AbstractController
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
     */
    public function list()
    {
        $locations = $this->getDoctrine()->getRepository(Location::class)->findAll();

        $context = new SerializationContext();
        $context->setGroups(['list']);
        $locations = $this->serializer->serialize($locations, 'json', $context);

        return new JsonResponse($locations, Response::HTTP_CREATED, [], true);
    }

    /**
     * @Route("", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function save(Request $request)
    {
        $locationRepository = $this->getDoctrine()->getRepository(Location::class);
        try {
            $location = $locationRepository->createLocationFromRequest($request);
        } catch (EntityNotFoundException $e) {
            return $this->json('Unknown location.', Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (UniqueConstraintViolationException $e) {
            return $this->json('A location with the same name already exists.', Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return $this->json('An error occurred when creating the location.', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $context = new SerializationContext();
        $context->setGroups(['list']);
        $location = $this->serializer->serialize($location, 'json', $context);

        return new JsonResponse($location, Response::HTTP_CREATED, [], true);
    }

    /**
     * @Route("/{id}", methods={"DELETE"}, requirements={"id"="\d+"})
     * @param Location $location
     * @return JsonResponse
     */
    public function delete(Location $location)
    {
        if (!$this->getUser()->isAdmin()) {
            return $this->json('Insufficient privileges to delete this location.', Response::HTTP_FORBIDDEN);
        }

        $manager = $this->getDoctrine()->getManager();
        $this->getDoctrine()->getRepository(Book::class)->removeLocation($location);
        $manager->remove($location);
        $manager->flush();

        return $this->json('Location successfully deleted.', Response::HTTP_OK);
    }
}
