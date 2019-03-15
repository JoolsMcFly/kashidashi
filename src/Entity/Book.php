<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\Table;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as Serializer;

/**
 * @ORM\Entity(repositoryClass="App\Repository\BookRepository")
 * @Table(indexes={
 *     @Index(name="book_title", columns={"title"}),
 *     @Index(name="book_code", columns={"code"})
 * })
 */
class Book
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Serializer\Groups({"details", "basic"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Serializer\Groups({"details", "basic"})
     */
    private $title;

    /**
     * @ORM\Column(type="smallint")
     * @Serializer\Groups({"details", "basic"})
     */
    private $code;

    /**
     * @var Location
     * @ORM\ManyToOne(targetEntity="Location")
     */
    private $location;

    /**
     * @ORM\Column(type="datetime")
     * @Gedmo\Timestampable(on="create")
     */
    private $createdAt;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Loan", mappedBy="book")
     * @Serializer\Groups({"details"})
     */
    private $loans;

    /**
     * @var array
     * @ORM\Column(type="text", nullable=true)
     * @Serializer\Groups({"details"})
     */
    private $stats;

    public function __construct()
    {
        $this->loans = new ArrayCollection();
        $this->stats = ['loansCount' => 0, 'loansDuration' => 0];
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
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @param string|null $title
     * @return Book
     */
    public function setTitle(?string $title): self
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getCode(): ?int
    {
        return $this->code;
    }

    /**
     * @param int $code
     * @return Book
     */
    public function setCode(int $code): self
    {
        $this->code = $code;

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
     * @return Collection|Loan[]
     */
    public function getLoans(): Collection
    {
        $criteria = new Criteria();
        $criteria->where(Criteria::expr()->isNull('stopped_at'));

        return $this->loans->matching($criteria);
    }

    /**
     * @param Loan $loan
     * @return Book
     */
    public function addLoan(Loan $loan): self
    {
        if (!$this->loans->contains($loan)) {
            $this->loans[] = $loan;
            $loan->setBook($this);
        }

        return $this;
    }

    /**
     * @param Loan $loan
     * @return Book
     */
    public function removeLoan(Loan $loan): self
    {
        if ($this->loans->contains($loan)) {
            $this->loans->removeElement($loan);
            // set the owning side to null (unless already changed)
            if ($loan->getBook() === $this) {
                $loan->setBook(null);
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
        $stats['loansCount']++;

        $this->setStats($stats);
    }

    /**
     * @param int $days
     */
    public function incLoansDuration(int $days): void
    {
        $stats = $this->getStats();
        $stats['loansDuration'] += $days;

        $this->setStats($stats);
    }

    /**
     * @return Location
     */
    public function getLocation(): ?Location
    {
        return $this->location;
    }

    /**
     * @param Location $location
     * @return Book
     */
    public function setLocation(Location $location): Book
    {
        $this->location = $location;

        return $this;
    }
}
