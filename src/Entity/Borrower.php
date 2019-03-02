<?php

namespace App\Entity;

use App\DataStructures\UserStats;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Index;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as Serializer;

/**
 * @ORM\Entity(repositoryClass="App\Repository\BorrowerRepository")
 * @ORM\Table(indexes={@Index(name="surname_firstname", columns={"surname", "firstname"})})
 */
class Borrower
{
    /**
     * @var int
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Serializer\Groups({"list"})
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(type="string", length=100, nullable=true)
     * @Serializer\Groups({"list", "details"})
     */
    private $firstname;

    /**
     * @var string
     * @ORM\Column(type="string", length=100)
     * @Serializer\Groups({"list", "details"})
     */
    private $surname;

    /**
     * @var \DateTime
     * @ORM\Column(type="datetime")
     * @Gedmo\Timestampable(on="create")
     */
    private $createdAt;

    /**
     * @var Loan[]
     * @ORM\OneToMany(targetEntity="App\Entity\Loan", mappedBy="borrower", orphanRemoval=true)
     */
    private $loans;

    /**
     * @var array
     * @ORM\Column(type="text", nullable=true)
     */
    private $stats;

    /**
     * User constructor.
     */
    public function __construct()
    {
        $this->loans = new ArrayCollection();
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
    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    /**
     * @param string|null $firstname
     * @return Borrower
     */
    public function setFirstname(?string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getSurname(): ?string
    {
        return $this->surname;
    }

    /**
     * @param string|null $surname
     * @return Borrower
     */
    public function setSurname(?string $surname): self
    {
        $this->surname = $surname;

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
     * @return Borrower
     */
    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Loan[]
     */
    public function getLoans()
    {
        return $this->loans;
    }

    /**
     * @param Loan $loan
     * @return Borrower
     */
    public function addLoan(Loan $loan): self
    {
        if (!$this->loans->contains($loan)) {
            $this->loans[] = $loan;
            $loan->setBorrower($this);
        }

        return $this;
    }

    /**
     * @param Loan $loan
     * @return Borrower
     */
    public function removeLoan(Loan $loan): self
    {
        if ($this->loans->contains($loan)) {
            $this->loans->removeElement($loan);
            // set the owning side to null (unless already changed)
            if ($loan->getBorrower() === $this) {
                $loan->setBorrower(null);
            }
        }

        return $this;
    }

    /**
     * @return array|null
     */
    public function getStats(): ?array
    {
        return $this->stats ? json_decode($this->stats, true) : ['loansCount' => 0, 'loansDuration' => 0];
    }

    /**
     * @param array $stats
     */
    public function setStats(array $stats): void
    {
        $this->stats = json_encode($stats);
    }

    public function incLoansCount(): void
    {
        $stats = $this->getStats();
        if (!isset($stats['loansCount'])) {
            $stats['loansCount'] = 1;
        } else {
            $stats['loansCount']++;
        }

        $this->setStats($stats);
    }
}
