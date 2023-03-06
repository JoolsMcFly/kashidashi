<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation as Serializer;

/**
 * @ORM\Entity()
 */
class Inventory
{
    /**
     * @var int
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Serializer\Groups({"details"})
     */
    private $id;

    /**
     * @var \DateTime
     * @ORM\Column(type="datetime")
     * @Serializer\Groups({"details"})
     */
    private $startedAt;

    /**
     * @var \DateTime
     * @ORM\Column(type="datetime", nullable=true)
     * @Serializer\Groups({"details"})
     */
    private $stoppedAt;

    /**
     * @var int
     * @ORM\Column(type="integer")
     * @Serializer\Groups({"details"})
     */
    private $bookCount = 0;

    /**
     * @var int
     * @ORM\Column(type="integer")
     * @Serializer\Groups({"details"})
     */
    private $availableBookCount = 0;

    /**
     * @ORM\OneToMany(targetEntity=InventoryItem::class, mappedBy="inventory", orphanRemoval=true)
     */
    private $items;

    public function __construct()
    {
        $this->items = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    public function getStartedAt(): \DateTime
    {
        return $this->startedAt;
    }

    public function setStartedAt(\DateTime $startedAt): Inventory
    {
        $this->startedAt = $startedAt;

        return $this;
    }

    public function getStoppedAt(): ?\DateTime
    {
        return $this->stoppedAt;
    }

    public function setStoppedAt(\DateTime $stoppedAt): Inventory
    {
        $this->stoppedAt = $stoppedAt;

        return $this;
    }

    public function getBookCount(): int
    {
        return $this->bookCount;
    }

    public function setBookCount(int $bookCount): Inventory
    {
        $this->bookCount = $bookCount;

        return $this;
    }

    public function increaseBookCount(int $count = 1): Inventory
    {
        $this->bookCount += $count;

        return $this;
    }

    public function decreaseBookCount(int $count = 1)
    {
        $this->bookCount -= $count;
    }

    public function getAvailableBookCount(): int
    {
        return $this->availableBookCount ?? 0;
    }

    public function setAvailableBookCount(int $availableBookCount): Inventory
    {
        $this->availableBookCount = $availableBookCount;

        return $this;
    }

    /**
     * @return Collection|InventoryItem[]
     */
    public function getItems(): Collection
    {
        return $this->items;
    }

    public function addItem(InventoryItem $item): self
    {
        if (!$this->items->contains($item)) {
            $this->items[] = $item;
            $item->setInventory($this);
        }

        return $this;
    }

    public function removeItem(InventoryItem $item): self
    {
        if ($this->items->removeElement($item)) {
            // set the owning side to null (unless already changed)
            if ($item->getInventory() === $this) {
                $item->setInventory(null);
            }
        }

        return $this;
    }
}
