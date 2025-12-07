import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  code: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  locationId: number;

  @IsOptional()
  @IsBoolean()
  deleted?: number;
}
