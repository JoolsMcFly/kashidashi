<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;
use JMS\Serializer\Annotation\Type;

/**
 * @ORM\Entity(repositoryClass="App\Repository\LoanRepository")
 */
class Loan
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Serializer\Groups({"details"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Book", inversedBy="loans", fetch="EAGER")
     * @ORM\JoinColumn(nullable=false, onDelete="cascade")
     * @Serializer\Groups({"details"})
     */
    private $book;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Borrower", inversedBy="loans", fetch="EAGER")
     * @ORM\JoinColumn(nullable=false)
     * @Serializer\Groups({"details"})
     */
    private $borrower;

    /**
     * @ORM\Column(type="datetime")
     * @Serializer\Groups({"details"})
     * @Type("DateTime<'Y-m-d'>")
     */
    private $startedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Serializer\Groups({"details"})
     * @Type("DateTime<'Y-m-d'>")
     */
    private $stoppedAt;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $creator;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Book|null
     */
    public function getBook(): ?Book
    {
        return $this->book;
    }

    /**
     * @param Book|null $book
     * @return Loan
     */
    public function setBook(?Book $book): self
    {
        $this->book = $book;

        return $this;
    }

    /**
     * @return User|null
     */
    public function getBorrower(): ?Borrower
    {
        return $this->borrower;
    }

    /**
     * @param User|null $borrower
     * @return Loan
     */
    public function setBorrower(?Borrower $borrower): self
    {
        $this->borrower = $borrower;

        return $this;
    }

    /**
     * @return \DateTimeInterface|null
     */
    public function getStartedAt(): ?\DateTimeInterface
    {
        return $this->startedAt;
    }

    /**
     * @param \DateTimeInterface $startedAt
     * @return Loan
     */
    public function setStartedAt(\DateTimeInterface $startedAt): self
    {
        $this->startedAt = $startedAt;

        return $this;
    }

    /**
     * @return \DateTimeInterface|null
     */
    public function getStoppedAt(): ?\DateTimeInterface
    {
        return $this->stoppedAt;
    }

    /**
     * @param \DateTimeInterface|null $stoppedAt
     * @return Loan
     */
    public function setStoppedAt(?\DateTimeInterface $stoppedAt): self
    {
        $this->stoppedAt = $stoppedAt;

        return $this;
    }

    /**
     * @Serializer\VirtualProperty(name="duration")
     * @Serializer\Groups({"details"})
     */
    public function duration()
    {
        return (new \DateTime())->diff($this->startedAt, true)->format('%a');
    }

    /**
     * @return User
     */
    public function getCreator(): User
    {
        return $this->creator;
    }

    /**
     * @param User $creator
     * @return Loan
     */
    public function setCreator(User $creator): Loan
    {
        $this->creator = $creator;

        return $this;
    }
}
