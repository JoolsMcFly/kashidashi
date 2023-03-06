<?php

namespace App\Controller\Api;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class ApiBaseController extends AbstractController
{
    private SerializerInterface $serializer;

    protected EntityManagerInterface $entityManager;

    public function __construct(SerializerInterface $serializer, EntityManagerInterface $entityManager)
    {
        $this->serializer = $serializer;
        $this->entityManager = $entityManager;
    }

    public function serialize($objects, array $context, string $dateFormat = 'Y-m-d')
    {
        $context[DateTimeNormalizer::FORMAT_KEY] = $dateFormat;
        return $this->serializer->serialize($objects, 'json', $context);
    }
}
