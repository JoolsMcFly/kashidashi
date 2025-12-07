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
        firstname: 'Yuki',
        surname: 'Tanaka',
        katakana: 'タナカ ユキ',
        frenchSurname: 'Dupont',
      },
      {
        firstname: 'Haruto',
        surname: 'Sato',
        katakana: 'サトウ ハルト',
        frenchSurname: 'Martin',
      },
      {
        firstname: 'Sakura',
        surname: 'Suzuki',
        katakana: 'スズキ サクラ',
        frenchSurname: 'Bernard',
      },
      {
        firstname: 'Ren',
        surname: 'Takahashi',
        katakana: 'タカハシ レン',
        frenchSurname: 'Dubois',
      },
      {
        firstname: 'Hina',
        surname: 'Watanabe',
        katakana: 'ワタナベ ヒナ',
        frenchSurname: 'Thomas',
      },
      {
        firstname: 'Sota',
        surname: 'Ito',
        katakana: 'イトウ ソウタ',
        frenchSurname: 'Robert',
      },
      {
        firstname: 'Aoi',
        surname: 'Yamamoto',
        katakana: 'ヤマモト アオイ',
        frenchSurname: 'Petit',
      },
      {
        firstname: 'Kaito',
        surname: 'Nakamura',
        katakana: 'ナカムラ カイト',
        frenchSurname: 'Richard',
      },
      {
        firstname: 'Mei',
        surname: 'Kobayashi',
        katakana: 'コバヤシ メイ',
        frenchSurname: 'Durand',
      },
      {
        firstname: 'Riku',
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
