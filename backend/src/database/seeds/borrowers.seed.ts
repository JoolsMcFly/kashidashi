import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrower } from '../../entities/borrower.entity';

@Injectable()
export class BorrowersSeed {
  constructor(
    @InjectRepository(Borrower)
    private borrowersRepository: Repository<Borrower>,
  ) {}

  async run(): Promise<void> {
    const existingCount = await this.borrowersRepository.count();

    if (existingCount > 0) {
      console.log('- Borrowers already exist, skipping...');
      return;
    }

    const borrowers = [
      {
        surname: 'Tanaka',
        katakana: 'タナカ ユキ',
        frenchSurname: 'Dupont',
      },
      {
        surname: 'Sato',
        katakana: 'サトウ ハルト',
        frenchSurname: 'Martin',
      },
      {
        surname: 'Suzuki',
        katakana: 'スズキ サクラ',
        frenchSurname: 'Bernard',
      },
      {
        surname: 'Takahashi',
        katakana: 'タカハシ レン',
        frenchSurname: 'Dubois',
      },
      {
        surname: 'Watanabe',
        katakana: 'ワタナベ ヒナ',
        frenchSurname: 'Thomas',
      },
      {
        surname: 'Ito',
        katakana: 'イトウ ソウタ',
        frenchSurname: 'Robert',
      },
      {
        surname: 'Yamamoto',
        katakana: 'ヤマモト アオイ',
        frenchSurname: 'Petit',
      },
      {
        surname: 'Nakamura',
        katakana: 'ナカムラ カイト',
        frenchSurname: 'Richard',
      },
      {
        surname: 'Kobayashi',
        katakana: 'コバヤシ メイ',
        frenchSurname: 'Durand',
      },
      {
        surname: 'Kato',
        katakana: 'カトウ リク',
        frenchSurname: 'Moreau',
      },
    ];

    for (const borrowerData of borrowers) {
      const borrower = this.borrowersRepository.create(borrowerData);
      await this.borrowersRepository.save(borrower);
    }

    console.log(`✓ Created ${borrowers.length} borrowers`);
  }
}
