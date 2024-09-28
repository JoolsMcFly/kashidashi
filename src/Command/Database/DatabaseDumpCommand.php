<?php

namespace App\Command\Database;

use App\Exception\FtpException;
use App\Service\Export\DBDumper;
use App\Service\FileEncrypter;
use App\Service\Ftp\Ftp;
use RuntimeException;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(name: 'admin:backup:dump', description: 'Dumps the database and uploads an encrypted version to the configured FTP.')]
class DatabaseDumpCommand extends Command
{
    private Ftp $ftp;

    private DBDumper $dumper;

    private FileEncrypter $fileEncrypter;

    protected function configure(): void
    {
    }

    public function __construct(DBDumper $dumper, Ftp $ftp, FileEncrypter $fileEncrypter)
    {
        parent::__construct();
        $this->ftp = $ftp;
        $this->dumper = $dumper;
        $this->fileEncrypter = $fileEncrypter;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        try {
            $dumpFile = $this->dumper->dump();
            $encryptedDumpFile = $this->fileEncrypter->encryptFile($dumpFile);
            if ($this->ftp->isEnabled()) {
                $io->comment($this->ftp->upload($encryptedDumpFile));
            } else {
                $io->warning(sprintf('FTP is not enabled, dump is only available locally: %s', $dumpFile));
            }
        } catch (RuntimeException $e) {
            $io->error("An error occurred when dumping the database:\n".$e->getMessage());

            return 1;
        } catch (FtpException $e) {
            $io->error("An error occurred when uploading the dump file:\n".$e->getMessage());

            return 2;
        }

        $io->success('Dump command executed successfully.');

        return 0;
    }
}
