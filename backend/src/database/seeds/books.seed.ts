import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../../entities';
import { Location } from '../../entities';

@Injectable()
export class BooksSeed {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  async run(): Promise<void> {
    const existingCount = await this.booksRepository.count();

    if (existingCount > 0) {
      console.log('- Books already exist, skipping...');
      return;
    }

    // Get locations to assign to books
    const locations = await this.locationsRepository.find();
    if (locations.length === 0) {
      console.log('⚠ No locations found. Please seed locations first.');
      return;
    }

    const books = [
      {
        code: '101',
        title: 'Japanese Grammar for Beginners',
        locationId: locations[0].id,
        deleted: false,
      },
      {
        code: '102',
        title: 'Kanji Learning Guide',
        locationId: locations[0].id,
        deleted: false,
      },
      {
        code: '103',
        title: 'Conversational Japanese',
        locationId: locations[1].id,
        deleted: false,
      },
      {
        code: '201',
        title: 'French for Japanese Speakers',
        locationId: locations[1].id,
        deleted: false,
      },
      {
        code: '202',
        title: 'Advanced French Grammar',
        locationId: locations[2].id,
        deleted: false,
      },
      {
        code: '203',
        title: 'French Culture and Society',
        locationId: locations[2].id,
        deleted: false,
      },
      {
        code: '301',
        title: 'English Business Communication',
        locationId: locations[3].id,
        deleted: false,
      },
      {
        code: '302',
        title: 'English Literature Classics',
        locationId: locations[3].id,
        deleted: false,
      },
      {
        code: '401',
        title: 'Japanese History Overview',
        locationId: locations[4].id,
        deleted: false,
      },
      {
        code: '402',
        title: 'World History: Modern Era',
        locationId: locations[4].id,
        deleted: false,
      },
      {
        code: '501',
        title: 'Introduction to Physics',
        locationId: locations[0].id,
        deleted: false,
      },
      {
        code: '502',
        title: 'Biology Fundamentals',
        locationId: locations[1].id,
        deleted: false,
      },
      {
        code: '1001',
        title: 'Calculus I',
        locationId: locations[2].id,
        deleted: false,
      },
      {
        code: '1002',
        title: 'Linear Algebra',
        locationId: locations[3].id,
        deleted: false,
      },
      {
        code: '1003',
        title: 'Murakami Collection',
        locationId: locations[4].id,
        deleted: false,
      },
      {
        code: '1004',
        title: 'Classic Japanese Literature',
        locationId: locations[0].id,
        deleted: false,
      },
      {
        code: '2001',
        title: 'Japanese Art History',
        locationId: locations[1].id,
        deleted: false,
      },
      {
        code: '2002',
        title: 'Modern Photography',
        locationId: locations[2].id,
        deleted: false,
      },
      {
        code: '3001',
        title: 'Music Theory Basics',
        locationId: locations[3].id,
        deleted: false,
      },
      {
        code: '3002',
        title: 'Jazz History',
        locationId: locations[4].id,
        deleted: false,
      },
    ];

    for (const bookData of books) {
      const book = this.booksRepository.create(bookData);
      await this.booksRepository.save(book);
    }

    console.log(`✓ Created ${books.length} books`);
  }
}
