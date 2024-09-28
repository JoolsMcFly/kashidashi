<?php

namespace App\Entity;

use App\Repository\LoanRepository;
use DateTime;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation as Serializer;

#[ORM\Entity(repositoryClass: LoanRepository::class)]
class Loan
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Serializer\Groups(['details', 'loan-details'])]
    private $id;

    #[ORM\ManyToOne(targetEntity: Book::class, inversedBy: 'loans', fetch: 'EAGER')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'cascade')]
    #[Serializer\Groups(['details', 'loan-details'])]
    private $book;

    #[ORM\ManyToOne(targetEntity: Borrower::class, inversedBy: 'loans', fetch: 'EAGER')]
    #[ORM\JoinColumn(nullable: false)]
    #[Serializer\Groups(['details', 'loan-details'])]
    private $borrower;

    #[ORM\Column(type: 'datetime')]
    #[Serializer\Groups(['details', 'loan-details'])]
    private $startedAt;

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Serializer\Groups(['details', 'loan-details'])]
    private $stoppedAt;

    /**
     * @var User
     */
    #[ORM\ManyToOne(targetEntity: \User::class)]
    private $creator;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBook(): ?Book
    {
        return $this->book;
    }

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
     */
    public function setBorrower(?Borrower $borrower): self
    {
        $this->borrower = $borrower;

        return $this;
    }

    public function getStartedAt(): ?DateTimeInterface
    {
        return $this->startedAt;
    }

    public function setStartedAt(DateTimeInterface $startedAt): self
    {
        $this->startedAt = $startedAt;

        return $this;
    }

    public function getStoppedAt(): ?DateTimeInterface
    {
        return $this->stoppedAt;
    }

    public function setStoppedAt(?DateTimeInterface $stoppedAt): self
    {
        $this->stoppedAt = $stoppedAt;

        return $this;
    }

    #[Serializer\Groups(['details'])]
    public function getDuration()
    {
        return (new DateTime())->diff($this->startedAt, true)->format('%a');
    }

    public function getCreator(): User
    {
        return $this->creator;
    }

    public function setCreator(User $creator): Loan
    {
        $this->creator = $creator;

        return $this;
    }
}
