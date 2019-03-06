<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;

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
     * @Serializer\Type("DateTime<'Y-m-d H:i:s'>")
     */
    private $startedAt;

    /**
     * @var \DateTime
     * @ORM\Column(type="datetime", nullable=true)
     * @Serializer\Groups({"details"})
     * @Serializer\Type("DateTime<'Y-m-d H:i:s'>")
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
     * @var string
     * @ORM\Column(type="text")
     */
    private $details = '';

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return \DateTime
     */
    public function getStartedAt(): \DateTime
    {
        return $this->startedAt;
    }

    /**
     * @param \DateTime $startedAt
     * @return Inventory
     */
    public function setStartedAt(\DateTime $startedAt): Inventory
    {
        $this->startedAt = $startedAt;

        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getStoppedAt(): ?\DateTime
    {
        return $this->stoppedAt;
    }

    /**
     * @param \DateTime $stoppedAt
     * @return Inventory
     */
    public function setStoppedAt(\DateTime $stoppedAt): Inventory
    {
        $this->stoppedAt = $stoppedAt;

        return $this;
    }

    /**
     * @return int
     */
    public function getBookCount(): int
    {
        return $this->bookCount;
    }

    /**
     * @param int $bookCount
     * @return Inventory
     */
    public function setBookCount(int $bookCount): Inventory
    {
        $this->bookCount = $bookCount;

        return $this;
    }

    /**
     * @param int $count
     * @return Inventory
     */
    public function increaseBookCount(int $count = 1): Inventory
    {
        $this->bookCount += $count;

        return $this;
    }

    /**
     * @param int $count
     */
    public function decreaseBookCount(int $count = 1)
    {
        $this->bookCount -= $count;
    }

    /**
     * @return array
     */
    public function getDetails(): array
    {
        if (empty($this->details)) {
            return [];
        }

        return json_decode($this->details, true);
    }

    /**
     * @param mixed $details
     * @return Inventory
     */
    public function setDetails($details): Inventory
    {
        if (is_array($details)) {
            $details = json_encode($details);
        }
        $this->details = $details;

        return $this;
    }

    /**
     * @return int
     */
    public function getAvailableBookCount(): int
    {
        return $this->availableBookCount ?? 0;
    }

    /**
     * @param int $availableBookCount
     * @return Inventory
     */
    public function setAvailableBookCount(int $availableBookCount): Inventory
    {
        $this->availableBookCount = $availableBookCount;

        return $this;
    }
}
