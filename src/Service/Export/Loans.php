<?php

namespace App\Service\Export;

use App\Entity\Loan;
use PhpOffice\PhpSpreadsheet\Exception;
use PhpOffice\PhpSpreadsheet\Writer\Exception as WriterException;

class Loans extends Exporter
{
    protected string $title = 'Loans';

    protected array $headers = ['Book', 'Borrower', 'Creator', 'Started At', 'Ended At'];

    /**
     * @throws Exception
     * @throws WriterException
     */
    public function export(): string
    {
        $data = array_map(function (Loan $loan) {
            return [
                $loan->getBook()->getId(),
                $loan->getBorrower()->getId(),
                $loan->getCreator()->getId(),
                $loan->getStartedAt()->format('Y-m-d H:i:s'),
                $loan->getStoppedAt() ? $loan->getStoppedAt()->format('Y-m-d H:i:s') : '',
            ];
        },
            $this->manager
                ->getRepository(Loan::class)
                ->createQueryBuilder('l')
                ->orderBy('l.startedAt', 'asc')
                ->getQuery()
                ->getResult()
        );

        return parent::exportData($data);
    }
}
