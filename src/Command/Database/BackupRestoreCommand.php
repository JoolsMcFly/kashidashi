<?php

namespace App\Command\Database;

use App\DataStructures\DBUser;
use App\Exception\FtpException;
use App\Service\Export\DBDumper;
use App\Service\FileEncrypter;
use App\Service\Ftp\Ftp;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ChoiceQuestion;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;

class BackupRestoreCommand extends Command
{
    protected static $defaultName = 'admin:backup:restore';

    private Ftp $ftp;

    private DBDumper $dumper;

    private FileEncrypter $fileEncrypter;

    protected function configure(): void
    {
        $this->setDescription('Restores a DB from available dumps.');
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
        if (!$this->ftp->isEnabled()) {
            $io->error('FTP must be enabled.');

            return 1;
        }

        $statusCode = 0;
        try {
            $dumps = $this->ftp->list();
            $dump = $this->askWhichDumpToRestore($dumps, $input, $output);
            $localFile = "/tmp/$dump";
            $this->ftp->download($dump, $localFile);

            $decryptedFile = $this->fileEncrypter->decryptFile($localFile, $localFile.'-decrypted');
            $io->note("Dump downloaded to $localFile and decrypted to $decryptedFile.");
            $dbUser = $this->askUsernameAndPassword($input, $output);
            $this->dumper->restore($decryptedFile, $dbUser);
            $io->success('Restore command executed successfully.');
        } catch (\RuntimeException $e) {
            $io->error("An error occurred when restoring the database:\n".$e->getMessage());
            $statusCode = 1;
        } catch (FtpException $e) {
            $io->error("An error occurred when downloading the dump file:\n".$e->getMessage());
            $statusCode = 2;
        } finally {
            if (!empty($localFile) && is_file($localFile)) {
                unlink($localFile);
            }

            if (!empty($decryptedFile) && is_file($decryptedFile)) {
                unlink($decryptedFile);
            }
        }

        return $statusCode;
    }

    private function askWhichDumpToRestore(array $dumps, InputInterface $input, OutputInterface $output): string
    {
        $questionHelper = $this->getHelper('question');

        $question = new ChoiceQuestion('Which dump would you like to restore?', $dumps);
        $question->setMaxAttempts(4);

        return $questionHelper->ask(
            $input,
            $output,
            $question
        );
    }

    private function askUsernameAndPassword(InputInterface $input, OutputInterface $output): DBUser
    {
        $questionHelper = $this->getHelper('question');

        $question = new Question('Enter DB username to restore dump:');
        $username = $questionHelper->ask($input, $output, $question);

        $question = new Question('Enter DB password to restore dump:');
        $question->setHidden(true);

        $password = $questionHelper->ask($input, $output, $question);

        return new DBUser($username, $password);
    }
}
