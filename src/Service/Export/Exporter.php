<?php

namespace App\Service\Export;

use Doctrine\ORM\EntityManagerInterface;
use LogicException;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

abstract class Exporter
{
    protected EntityManagerInterface $manager;

    private Worksheet $worksheet;

    private Spreadsheet $spreadsheet;

    protected string $title = 'Untitled';

    /**
     * @var string[]
     */
    protected array $headers = [];

    /**
     * @throws LogicException
     */
    public function __construct(EntityManagerInterface $manager)
    {
        if (empty($this->headers)) {
            throw new LogicException('You should set header property in child classes.');
        }

        $this->manager = $manager;
        $this->spreadsheet = new Spreadsheet();
        $this->worksheet = $this->spreadsheet->getActiveSheet();
    }

    protected function exportData(array $data): string
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
        for ($col = 0; $col < $headersCount; ++$col) {
            $this->worksheet->getColumnDimension($letter)->setAutoSize(true);
            ++$letter;
        }
    }
}
