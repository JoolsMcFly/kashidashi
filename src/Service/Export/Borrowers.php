<?php

namespace App\Service\Export;

use App\Entity\Borrower;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class Borrowers
{
    /**
     * @var EntityManagerInterface
     */
    private $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @return string
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     * @throws \PhpOffice\PhpSpreadsheet\Writer\Exception
     */
    public function export(): string
    {
        $spreadsheet = new Spreadsheet();
        $worksheet = $spreadsheet->getActiveSheet();
        $worksheet->setTitle('Borrowers');
        $borrowers = $this->manager->getRepository(Borrower::class)->findBy([], ['surname' => 'asc']);
        $headers = ['Surname', 'French surname', 'Katakana'];
        $data = [$headers];
        foreach ($borrowers as $borrower) {
            $data[] = [
                $borrower->getSurname(),
                $borrower->getFrenchSurname(),
                $borrower->getKatakana(),
            ];
        }
        $worksheet->fromArray($data);

        $headersCount = count($headers);
        $letter = 'A';
        for ($col = 0; $col < $headersCount; $col++) {
            $worksheet->getColumnDimension($letter)->setAutoSize(true);
            $letter++;
        }

        $filename = '/tmp/borrowers-' . date('Y-m-d-H-i-s') . '.xlsx';
        (new Xlsx($spreadsheet))->save($filename);

        return $filename;
    }
}
