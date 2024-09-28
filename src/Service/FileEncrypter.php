<?php

namespace App\Service;

use RuntimeException;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class FileEncrypter
{
    private string $cipher = 'aes-256-cbc';

    private string $shaAlgo = 'sha256';

    private int $ivLength = 16;

    private string $filePassword;

    public function __construct(ParameterBagInterface $parameterBag)
    {
        $this->filePassword = (string) $parameterBag->get('security.file_password');
    }

    public function encryptFile(string $inputFile, ?string $outputFile = null): string
    {
        $outputFile = $outputFile ?? "$inputFile.gpg";
        file_put_contents($outputFile, $this->encryptString(file_get_contents($inputFile)));

        return $outputFile;
    }

    public function decryptFile(string $inputFile, ?string $outputFile = null): string
    {
        $outputFile = $outputFile ?? str_replace('.gpg', '', $inputFile);
        file_put_contents($outputFile, $this->decryptString(file_get_contents($inputFile)));

        return $outputFile;
    }

    public function encryptString(string $contents): string
    {
        $key = hash($this->shaAlgo, $this->filePassword, true);
        $iv = openssl_random_pseudo_bytes($this->ivLength);

        $ciphertext = openssl_encrypt($contents, $this->cipher, $key, OPENSSL_RAW_DATA, $iv);
        $hash = hash_hmac($this->shaAlgo, $ciphertext.$iv, $key, true);

        return base64_encode($iv.$hash.$ciphertext);
    }

    public function decryptString(string $content): string
    {
        $content = base64_decode($content);
        $iv = substr($content, 0, $this->ivLength);
        $hash = substr($content, $this->ivLength, $this->ivLength * 2);
        $encryptedContent = substr($content, $this->ivLength * 3);
        $key = hash($this->shaAlgo, $this->filePassword, true);

        if (!hash_equals(hash_hmac($this->shaAlgo, $encryptedContent.$iv, $key, true), $hash)) {
            throw new RuntimeException('Hashes do not match. Cannot decrypt file contents.');
        }

        return openssl_decrypt($encryptedContent, $this->cipher, $key, OPENSSL_RAW_DATA, $iv);
    }
}
