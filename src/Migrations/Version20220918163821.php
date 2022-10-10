<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220918163821 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE book (id INT AUTO_INCREMENT NOT NULL, location_id INT DEFAULT NULL, title VARCHAR(255) DEFAULT NULL, code SMALLINT NOT NULL, created_at DATETIME NOT NULL, stats LONGTEXT DEFAULT NULL, INDEX IDX_CBE5A33164D218E (location_id), INDEX book_title (title), INDEX book_code (code), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE borrower (id INT AUTO_INCREMENT NOT NULL, firstname VARCHAR(100) DEFAULT NULL, surname VARCHAR(100) NOT NULL, katakana VARCHAR(100) NOT NULL, french_surname VARCHAR(100) NOT NULL, created_at DATETIME NOT NULL, stats LONGTEXT DEFAULT NULL, INDEX surname_firstname (surname, firstname), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inventory (id INT AUTO_INCREMENT NOT NULL, started_at DATETIME NOT NULL, stopped_at DATETIME DEFAULT NULL, book_count INT NOT NULL, available_book_count INT NOT NULL, details LONGTEXT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE loan (id INT AUTO_INCREMENT NOT NULL, book_id INT NOT NULL, borrower_id INT NOT NULL, creator_id INT DEFAULT NULL, started_at DATETIME NOT NULL, stopped_at DATETIME DEFAULT NULL, INDEX IDX_C5D30D0316A2B381 (book_id), INDEX IDX_C5D30D0311CE312B (borrower_id), INDEX IDX_C5D30D0361220EA6 (creator_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE location (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX location_name (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(255) NOT NULL, firstname VARCHAR(100) DEFAULT NULL, surname VARCHAR(100) DEFAULT NULL, password VARCHAR(100) NOT NULL, created_at DATETIME NOT NULL, roles VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE book ADD CONSTRAINT FK_CBE5A33164D218E FOREIGN KEY (location_id) REFERENCES location (id)');
        $this->addSql('ALTER TABLE loan ADD CONSTRAINT FK_C5D30D0316A2B381 FOREIGN KEY (book_id) REFERENCES book (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE loan ADD CONSTRAINT FK_C5D30D0311CE312B FOREIGN KEY (borrower_id) REFERENCES borrower (id)');
        $this->addSql('ALTER TABLE loan ADD CONSTRAINT FK_C5D30D0361220EA6 FOREIGN KEY (creator_id) REFERENCES `user` (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE loan DROP FOREIGN KEY FK_C5D30D0316A2B381');
        $this->addSql('ALTER TABLE loan DROP FOREIGN KEY FK_C5D30D0311CE312B');
        $this->addSql('ALTER TABLE book DROP FOREIGN KEY FK_CBE5A33164D218E');
        $this->addSql('ALTER TABLE loan DROP FOREIGN KEY FK_C5D30D0361220EA6');
        $this->addSql('DROP TABLE book');
        $this->addSql('DROP TABLE borrower');
        $this->addSql('DROP TABLE inventory');
        $this->addSql('DROP TABLE loan');
        $this->addSql('DROP TABLE location');
        $this->addSql('DROP TABLE `user`');
    }
}
