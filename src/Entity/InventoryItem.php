<?php

namespace App\Entity;

use App\Repository\InventoryItemRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation as Serializer;

/**
 * @ORM\Entity(repositoryClass=InventoryItemRepository::class)
 */
class InventoryItem
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Inventory::class, inversedBy="items")
     * @ORM\JoinColumn(nullable=false)
     */
    private $inventory;

    /**
     * @ORM\ManyToOne(targetEntity=Book::class, cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $book;

    /**
     * @ORM\ManyToOne(targetEntity=Location::class)
     * @ORM\JoinColumn(nullable=false)
     * @Serializer\Groups({"basic"})
     */
    private $foundAt;

    /**
     * @ORM\ManyToOne(targetEntity=Location::class)
     * @Serializer\Groups({"basic"})
     */
    private $belongsAt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getInventory(): ?Inventory
    {
        return $this->inventory;
    }

    public function setInventory(?Inventory $inventory): self
    {
        $this->inventory = $inventory;

        return $this;
    }

    public function getBook(): ?Book
    {
        return $this->book;
    }

    public function setBook(Book $book): self
    {
        $this->book = $book;

        return $this;
    }

    public function getFoundAt(): ?Location
    {
        return $this->foundAt;
    }

    public function setFoundAt(?Location $foundAt): self
    {
        $this->foundAt = $foundAt;

        return $this;
    }

    public function getBelongsAt(): ?Location
    {
        return $this->belongsAt;
    }

    public function setBelongsAt(?Location $belongsAt): self
    {
        $this->belongsAt = $belongsAt;

        return $this;
    }
}
