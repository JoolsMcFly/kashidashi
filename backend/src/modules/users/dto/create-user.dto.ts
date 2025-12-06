import { IsNotEmpty, IsString, IsBoolean, IsNumber, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsNotEmpty()
  @IsNumber()
  locationId: number;
}
