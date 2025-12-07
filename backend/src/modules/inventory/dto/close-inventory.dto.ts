import { IsOptional, IsDateString } from 'class-validator';

export class CloseInventoryDto {
  @IsOptional()
  @IsDateString()
  stoppedAt?: string;
}
