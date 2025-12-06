import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../../entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationsRepository.create(createLocationDto);
    return this.locationsRepository.save(location);
  }

  async findAll(): Promise<Location[]> {
    return this.locationsRepository.find();
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.locationsRepository.findOne({ where: { id } });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }
}
