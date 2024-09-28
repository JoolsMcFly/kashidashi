<?php

namespace App\DataStructures;

class UploadStats
{
    /**
     * @var int
     */
    private $uploaded = 0;

    /**
     * @var int
     */
    private $existing = 0;

    public function getUploaded(): int
    {
        return $this->uploaded;
    }

    public function addUploaded(int $uploaded = 1): void
    {
        $this->uploaded += $uploaded;
    }

    public function getExisting(): int
    {
        return $this->existing;
    }

    public function addExisting(int $existing = 1): void
    {
        $this->existing += $existing;
    }

    public function getChangesReport(): string
    {
        return $this->getExisting().' existing and '.$this->getUploaded().' new';
    }
}
