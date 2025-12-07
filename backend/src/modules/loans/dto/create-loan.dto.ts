import { IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateLoanDto {
  @IsNotEmpty()
  @IsNumber()
  borrowerId: number;

  @IsNotEmpty()
  @IsNumber()
  bookId: number;

  @IsOptional()
  @IsNumber()
  creatorId?: number;

  @IsOptional()
  @IsDateString()
  startedAt?: string;
}
