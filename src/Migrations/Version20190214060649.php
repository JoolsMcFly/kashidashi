<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190214060649 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE borrower ALTER email DROP NOT NULL');
        $this->addSql('ALTER TABLE borrower ALTER surname SET NOT NULL');
        $this->addSql('CREATE INDEX surname_firstname ON borrower (surname, firstname)');
        $this->addSql('CREATE INDEX book_title ON book (title)');
        $this->addSql('CREATE INDEX book_code ON book (code)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('DROP INDEX book_title');
        $this->addSql('DROP INDEX book_code');
        $this->addSql('DROP INDEX surname_firstname');
        $this->addSql('ALTER TABLE borrower ALTER email SET NOT NULL');
        $this->addSql('ALTER TABLE borrower ALTER surname DROP NOT NULL');
    }
}
