<?php

namespace App\DataStructures;

use Symfony\Component\Serializer\Annotation as Serializer;

class TypeahedSuggestion
{
    /**
     * @var string
     */
    #[Serializer\Groups(['details'])]
    private $text;

    #[Serializer\Groups(['details'])]
    private $item;

    /**
     * @var string
     */
    #[Serializer\Groups(['details'])]
    private $type;

    /**
     * TypeahedSuggestion constructor.
     */
    public function __construct(string $text, $item, string $type)
    {
        $this->text = $text;
        $this->item = $item;
        $this->type = $type;
    }

    public function getText(): string
    {
        return $this->text;
    }

    public function getItem()
    {
        return $this->item;
    }

    public function getType(): string
    {
        return $this->type;
    }
}
