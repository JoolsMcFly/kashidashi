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

    /**
     * @return int
     */
    public function getUploaded(): int
    {
        return $this->uploaded;
    }

    /**
     * @param int $uploaded
     */
    public function addUploaded(int $uploaded = 1): void
    {
        $this->uploaded += $uploaded;
    }

    /**
     * @return int
     */
    public function getExisting(): int
    {
        return $this->existing;
    }

    /**
     * @param int $existing
     */
    public function addExisting(int $existing = 1): void
    {
        $this->existing += $existing;
    }
}
