import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateBorrowerDto {
  @IsOptional()
  @IsString()
  firstname?: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  katakana: string;

  @IsNotEmpty()
  @IsString()
  frenchSurname: string;
}
