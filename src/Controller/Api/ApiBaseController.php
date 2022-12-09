<?php

namespace App\Controller\Api;


use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ApiBaseController extends AbstractController
{
    private SerializerInterface $serializer;

    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }

    /**
     * @param mixed $objects
     */
    public function serialize($objects, SerializationContext $context)
    {
        return $this->serializer->serialize($objects, 'json', $context);
    }
}
