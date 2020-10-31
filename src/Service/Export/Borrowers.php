<?php

namespace App\Service\Export;

use App\Entity\Borrower;

class Borrowers extends Exporter
{
    protected $title = 'Borrowers';

    protected $headers = ['Surname', 'French surname', 'Katakana'];

    /**
     * @return string
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     * @throws \PhpOffice\PhpSpreadsheet\Writer\Exception
     */
    public function export(): string
    {
        $borrowers = $this->manager->getRepository(Borrower::class)->findBy([], ['surname' => 'asc']);
        $data = [];
        foreach ($borrowers as $borrower) {
            $data[] = [
                $borrower->getSurname(),
                $borrower->getFrenchSurname(),
                $borrower->getKatakana(),
            ];
        }

        return parent::exportData($data);
    }
}
