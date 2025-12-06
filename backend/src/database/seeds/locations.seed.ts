import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../../entities/location.entity';

@Injectable()
export class LocationsSeed {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  async run(): Promise<void> {
    const existingCount = await this.locationsRepository.count();

    if (existingCount > 0) {
      console.log('- Locations already exist, skipping...');
      return;
    }

    const locations = [
      { name: 'Tokyo Library' },
      { name: 'Osaka Library' },
      { name: 'Kyoto Library' },
      { name: 'Yokohama Library' },
      { name: 'Nagoya Library' },
    ];

    for (const locationData of locations) {
      const location = this.locationsRepository.create(locationData);
      await this.locationsRepository.save(location);
    }

    console.log(`✓ Created ${locations.length} locations`);
  }
}
