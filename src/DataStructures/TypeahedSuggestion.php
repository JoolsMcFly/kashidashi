<?php

namespace App\DataStructures;

use JMS\Serializer\Annotation as Serializer;

class TypeahedSuggestion
{
    /**
     * @var string
     * @Serializer\Groups("details")
     */
    private $text;

    /**
     * @var mixed
     * @Serializer\Groups("details")
     */
    private $item;

    /**
     * @var string
     * @Serializer\Groups("details")
     */
    private $type;

    /**
     * TypeahedSuggestion constructor.
     * @param string $text
     * @param $item
     * @param string $type
     */
    public function __construct(string $text, $item, string $type)
    {
        $this->text = $text;
        $this->item = $item;
        $this->type = $type;
    }

    /**
     * @return string
     */
    public function getText(): string
    {
        return $this->text;
    }

    /**
     * @return mixed
     */
    public function getItem()
    {
        return $this->item;
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }
}
