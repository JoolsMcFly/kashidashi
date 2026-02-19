import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBorrowerDto {
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
