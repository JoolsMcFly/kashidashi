import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBorrowerDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  katakana: string;

  @IsNotEmpty()
  @IsString()
  frenchSurname: string;
}
