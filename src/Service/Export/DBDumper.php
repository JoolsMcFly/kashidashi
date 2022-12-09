<?php

namespace App\Service\Export;

use App\DataStructures\DBUser;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

class DBDumper
{
    private string $mysqlDefaultsFile;

    private string $database;

    private string $dumperUser;

    public function __construct(ContainerBagInterface $containerBag, EntityManagerInterface $entityManager)
    {
        if (PHP_SAPI !== 'cli') {
            throw new \RuntimeException('DB operations only possible via CLI.');
        }

        $this->mysqlDefaultsFile = (string) $containerBag->get('mysql.defaults_file');
        $this->dumperUser = (string) $containerBag->get('mysql.dumper_user');
        $this->database = $entityManager->getConnection()->getDatabase();
    }

    public function dump(): string
    {
        $timestamp = date('Y-m-d-H:i:s');
        $dumpFile = '/tmp/dump-'.$timestamp;
        $output = shell_exec("mysqldump --defaults-file={$this->mysqlDefaultsFile} -u {$this->dumperUser} {$this->database} > $dumpFile");

        if (!is_file($dumpFile)) {
            throw new \RuntimeException(sprintf("Could not dump to %s:\n%s", $dumpFile, $output));
        }

        return $dumpFile;
    }

    public function restore(string $dumpFile, DBUser $user)
    {
        if (!is_file($dumpFile) || !is_readable($dumpFile)) {
            throw new \RuntimeException(sprintf('Could not open dump file for processing (%s).', $dumpFile));
        }

        return shell_exec("mysql -u {$user->getUsername()} -p{$user->getPassword()} {$this->database} < $dumpFile");
    }
}
