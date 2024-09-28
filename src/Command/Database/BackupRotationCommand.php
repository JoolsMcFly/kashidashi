<?php

namespace App\Command\Database;

use App\Exception\FtpException;
use App\Service\Ftp\Ftp;
use RuntimeException;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'admin:backup:rotation',
    description: 'Performs backup rotations on the FTP server.'
)]
class BackupRotationCommand extends Command
{
    private Ftp $ftp;

    private const MAX_DUMPS = 5;

    protected function configure(): void
    {
    }

    public function __construct(Ftp $ftp)
    {
        parent::__construct();
        $this->ftp = $ftp;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        try {
            if (!$this->ftp->isEnabled()) {
                $io->error('FTP is not enabled.');

                return 1;
            }

            $this->ftp->delete(
                array_slice($this->ftp->list(), self::MAX_DUMPS)
            );
        } catch (RuntimeException|FtpException $e) {
            $io->error("An error occurred when deleting dump files:\n".$e->getMessage());

            return 2;
        }

        $io->success('Dump rotation command executed successfully.');

        return 0;
    }
}
