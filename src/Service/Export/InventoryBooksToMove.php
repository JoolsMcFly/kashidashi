<?php

namespace App\Service\Export;

use App\Entity\Inventory;
use App\Entity\InventoryItem;

class InventoryBooksToMove extends Exporter
{
    protected string $title = 'Inventory - Books to move';

    protected array $headers = ['Code', 'Title', 'Move To'];

    public function export(Inventory $inventory): string
    {
        $data = array_map(
            function (array $inventoryItem) {
                return [
                    $inventoryItem['code'],
                    $inventoryItem['title'],
                    $inventoryItem['previousLoc'] ?: 'Unspecified',
                ];
            }, $this->manager
            ->getRepository(InventoryItem::class)
            ->findBooksToMove($inventory)
        );

        return parent::exportData($data);
    }
}
