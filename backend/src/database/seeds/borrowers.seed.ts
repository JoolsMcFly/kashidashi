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
        lastname: 'Tanaka',
        katakana: 'タナカ ユキ',
        frenchSurname: 'Dupont',
      },
      {
        firstname: 'Haruto',
        lastname: 'Sato',
        katakana: 'サトウ ハルト',
        frenchSurname: 'Martin',
      },
      {
        firstname: 'Sakura',
        lastname: 'Suzuki',
        katakana: 'スズキ サクラ',
        frenchSurname: 'Bernard',
      },
      {
        firstname: 'Ren',
        lastname: 'Takahashi',
        katakana: 'タカハシ レン',
        frenchSurname: 'Dubois',
      },
      {
        firstname: 'Hina',
        lastname: 'Watanabe',
        katakana: 'ワタナベ ヒナ',
        frenchSurname: 'Thomas',
      },
      {
        firstname: 'Sota',
        lastname: 'Ito',
        katakana: 'イトウ ソウタ',
        frenchSurname: 'Robert',
      },
      {
        firstname: 'Aoi',
        lastname: 'Yamamoto',
        katakana: 'ヤマモト アオイ',
        frenchSurname: 'Petit',
      },
      {
        firstname: 'Kaito',
        lastname: 'Nakamura',
        katakana: 'ナカムラ カイト',
        frenchSurname: 'Richard',
      },
      {
        firstname: 'Mei',
        lastname: 'Kobayashi',
        katakana: 'コバヤシ メイ',
        frenchSurname: 'Durand',
      },
      {
        firstname: 'Riku',
        lastname: 'Kato',
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
