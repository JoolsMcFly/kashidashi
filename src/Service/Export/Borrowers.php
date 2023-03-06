<?php

namespace App\Service\Export;

use App\Entity\Borrower;
use PhpOffice\PhpSpreadsheet\Exception;
use PhpOffice\PhpSpreadsheet\Writer\Exception as WriterException;

class Borrowers extends Exporter
{
    protected string $title = 'Borrowers';

    protected array $headers = ['ID', 'Surname', 'French surname', 'Katakana'];

    /**
     * @throws Exception
     * @throws WriterException
     */
    public function export(): string
    {
        $borrowers = $this->manager->getRepository(Borrower::class)->findBy([], ['surname' => 'asc']);
        $data = [];
        foreach ($borrowers as $borrower) {
            $data[] = [
                $borrower->getId(),
                $borrower->getSurname(),
                $borrower->getFrenchSurname(),
                $borrower->getKatakana(),
            ];
        }

        return parent::exportData($data);
    }
}
