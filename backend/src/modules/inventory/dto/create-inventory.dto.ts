import { IsOptional, IsDateString } from 'class-validator';

export class CreateInventoryDto {
  @IsOptional()
  @IsDateString()
  startedAt?: string;
}
