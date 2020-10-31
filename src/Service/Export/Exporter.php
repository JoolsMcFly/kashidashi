<?php

namespace App\Service\Export;

use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

abstract class Exporter
{
    /**
     * @var EntityManagerInterface
     */
    protected $manager;

    /**
     * @var Worksheet
     */
    private $worksheet;

    /**
     * @var Spreadsheet
     */
    private $spreadsheet;

    /**
     * @var string
     */
    protected $title = 'Untitled';

    /**
     * @var array|string[]
     */
    protected $headers = [];

    public function __construct(EntityManagerInterface $manager)
    {
        if (empty($this->headers)) {
            throw new \Exception("You should set header property in child classes.");
        }

        $this->manager = $manager;
        $this->spreadsheet = new Spreadsheet();
        $this->worksheet = $this->spreadsheet->getActiveSheet();
    }

    public function exportData(array $data): string
    {
        array_unshift($data, $this->headers);
        $this->worksheet->fromArray($data);

        $this->adjustHeaders();

        $filename = "/tmp/{$this->title}-".date('Y-m-d-H-i-s').'.xlsx';
        (new Xlsx($this->spreadsheet))->save($filename);

        return $filename;
    }

    private function adjustHeaders(): void
    {
        $headersCount = count($this->headers);
        $letter = 'A';
        for ($col = 0; $col < $headersCount; $col++) {
            $this->worksheet->getColumnDimension($letter)->setAutoSize(true);
            $letter++;
        }
    }
}
