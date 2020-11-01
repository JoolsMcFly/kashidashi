<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\Table;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as Serializer;

/**
 * @ORM\Entity(repositoryClass="App\Repository\LocationRepository")
 * @Table(indexes={
 *     @Index(name="location_name", columns={"name"}),
 * })
 */
class Location
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Serializer\Groups({"list"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Serializer\Groups({"list", "details"})
     */
    private $name;

    /**
     * @ORM\Column(type="datetime")
     * @Gedmo\Timestampable(on="create")
     */
    private $createdAt;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Book", mappedBy="location")
     */
    private $books;

    /**
     * @var Inventory[]
     * @ORM\OneToMany(targetEntity="App\Entity\Inventory", mappedBy="location")
     * @Serializer\Groups({"details"})
     */
    private $inventories;

    public function __construct()
    {
        $this->books = new ArrayCollection();
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string|null $name
     * @return Book
     */
    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return \DateTimeInterface|null
     */
    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
     * @param \DateTimeInterface $createdAt
     * @return Book
     */
    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @Serializer\VirtualProperty()
     * @Serializer\Groups({"list"})
     */
    public function bookCount()
    {
        return $this->books->count();
    }

    public function __toString(): string
    {
        return $this->name;
    }

    /**
     * @return Inventory[]
     */
    public function getInventories(): array
    {
        return $this->inventories;
    }

    /**
     * @param Inventory[] $inventories
     */
    public function setInventories(array $inventories): void
    {
        $this->inventories = $inventories;
    }
}
