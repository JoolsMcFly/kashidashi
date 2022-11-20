<?php

namespace App\Service\Ftp;

use App\Exception\FtpException;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

class Ftp
{
    private const LOGIN_ERROR = 1;

    private const UPLOAD_ERROR = 2;

    const MISSING_SETTINGS = 3;

    private string $ftpServer;

    private string $ftpLogin;

    private string $ftpPassword;

    private string $dumpDir = "kashidashi/";

    public function __construct(ContainerBagInterface $containerBag)
    {
        $this->ftpServer = (string)$containerBag->get('ftp.server');
        $this->ftpLogin = (string)$containerBag->get('ftp.login');
        $this->ftpPassword = (string)$containerBag->get('ftp.password');
    }

    /**
     * @throws FtpException
     */
    public function upload(string $filePath): string
    {
        if (!$this->isEnabled()) {
            throw new FtpException("Ftp settings not found.", self::MISSING_SETTINGS);
        }

        $ftp = $this->connect();
        $ftpRemotePath = $this->dumpDir.basename($filePath);
        if (!ftp_put($ftp, $ftpRemotePath, $filePath, FTP_BINARY)) {
            ftp_close($ftp);
            throw new FtpException("Could not upload $filePath to $this->ftpServer", self::UPLOAD_ERROR);
        }

        ftp_close($ftp);

        return "Dump uploaded to $this->ftpServer/$ftpRemotePath.";
    }

    /**
     * @throws FtpException
     */
    public function download(string $filename, string $localFile)
    {
        $ftp = $this->connect();
        $file = ftp_get($ftp, $localFile, $this->dumpDir.$filename);
        ftp_close($ftp);

        if (false === $file) {
            throw new FtpException("Could not download $filename as $localFile.");
        }
    }

    /**
     * @throws FtpException
     */
    public function list(): array
    {
        $ftp = $this->connect();
        $files = ftp_nlist($ftp, $this->dumpDir);
        ftp_close($ftp);

        if ($files === false) {
            throw new FtpException('Could not retrieve dumps from FTP.');
        }

        $files = array_map(
            function (string $file) {
                return str_replace($this->dumpDir.'/', '', $file);
            }, $files
        );

        $files = array_values(
            array_filter(
                $files,
                function (string $file) {
                    return !in_array($file, ['.', '..']);
                }
            )
        );

        rsort($files);

        return $files;
    }

    public function isEnabled(): bool
    {
        return !empty($this->ftpServer) && !empty($this->ftpLogin) && !empty($this->ftpPassword);
    }

    /**
     * @return resource
     * @throws FtpException
     */
    private function connect()
    {
        $ftp = ftp_connect($this->ftpServer);
        try {
            $login = ftp_login($ftp, $this->ftpLogin, $this->ftpPassword);
        } catch (\Exception $e) {
            throw new FtpException("Could not login to $this->ftpServer. Upload aborted.", self::LOGIN_ERROR);
        }

        if (!$ftp || !$login) {
            throw new FtpException("Could not connect to $this->ftpServer with login '$this->ftpLogin'.", self::LOGIN_ERROR);
        }
        ftp_set_option($ftp, FTP_USEPASVADDRESS, false);
        ftp_pasv($ftp, true);

        return $ftp;
    }

    /**
     * @throws FtpException
     */
    public function delete(array $dumps)
    {
        if (count($dumps) <= 0) {
            return;
        }

        $ftp = $this->connect();
        try {
            foreach ($dumps as $dump) {
                $distantFile = $this->dumpDir.$dump;
                ftp_delete($ftp, $distantFile);
            }
        } catch (\Exception $e) {
        }
        ftp_close($ftp);
    }
}
