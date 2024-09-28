<?php

namespace App\Entity;

use App\Repository\BorrowerRepository;
use DateTime;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Index;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Annotation as Serializer;

#[ORM\Entity(repositoryClass: BorrowerRepository::class)]
#[ORM\Table]
#[Index(name: 'surname_firstname', columns: ['surname', 'firstname'])]
class Borrower
{
    /**
     * @var int
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Serializer\Groups(['list', 'details', 'loan-details'])]
    private $id;

    /**
     * @var string
     */
    #[ORM\Column(type: 'string', length: 100, nullable: true)]
    #[Serializer\Groups(['list', 'details', 'loan-details'])]
    private $firstname;

    /**
     * @var string
     */
    #[ORM\Column(type: 'string', length: 100)]
    #[Serializer\Groups(['list', 'details', 'loan-details'])]
    private $surname;

    /**
     * @var string
     */
    #[ORM\Column(type: 'string', length: 100)]
    #[Serializer\Groups(['list', 'details', 'loan-details'])]
    private $katakana;

    /**
     * @var string
     */
    #[ORM\Column(type: 'string', length: 100)]
    #[Serializer\Groups(['list', 'details', 'loan-details'])]
    private $frenchSurname;

    /**
     * @var DateTime
     *
     * @Gedmo\Timestampable(on="create")
     */
    #[ORM\Column(type: 'datetime')]
    private $createdAt;

    /**
     * @var Loan[]
     */
    #[ORM\OneToMany(targetEntity: Loan::class, mappedBy: 'borrower', orphanRemoval: true)]
    private $loans;

    /**
     * @var array
     */
    #[ORM\Column(type: 'text', nullable: true)]
    #[Serializer\Groups(['details', 'list'])]
    private $stats;

    public function __construct()
    {
        $this->loans = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(?string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getSurname(): ?string
    {
        return $this->surname;
    }

    public function setSurname(?string $surname): self
    {
        $this->surname = $surname;

        return $this;
    }

    public function getCreatedAt(): ?DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getLoans()
    {
        return $this->loans;
    }

    public function addLoan(Loan $loan): self
    {
        if (!$this->loans->contains($loan)) {
            $this->loans[] = $loan;
            $loan->setBorrower($this);
        }

        return $this;
    }

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

    public function getStats(): ?array
    {
        return $this->stats ? json_decode($this->stats, true) : ['loansCount' => 0, 'loansDuration' => 0];
    }

    public function setStats(array $stats): void
    {
        $this->stats = json_encode($stats);
    }

    public function incLoansCount(): void
    {
        $stats = $this->getStats();
        ++$stats['loansCount'];

        $this->setStats($stats);
    }

    public function incLoansDuration(int $days): void
    {
        $stats = $this->getStats();
        $stats['loansDuration'] += $days;

        $this->setStats($stats);
    }

    public function __toString()
    {
        return $this->surname.' '.$this->firstname;
    }

    public function getKatakana(): string
    {
        return $this->katakana;
    }

    public function setKatakana(string $katakana): Borrower
    {
        $this->katakana = $katakana;

        return $this;
    }

    public function getFrenchSurname(): string
    {
        return $this->frenchSurname;
    }

    public function setFrenchSurname(string $frenchSurname): Borrower
    {
        $this->frenchSurname = $frenchSurname;

        return $this;
    }

    #[Serializer\Groups(['details', 'list', 'loan-details'])]
    public function getFullName(): string
    {
        $fullname = $this->getKatakana().' ('.$this->getSurname().')';
        if ($this->getSurname() !== $this->getFrenchSurname()) {
            $fullname .= ' / '.$this->getFrenchSurname();
        }

        return $fullname;
    }
}
