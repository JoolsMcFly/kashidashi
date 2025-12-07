import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddInventoryItemDto {
  @IsNotEmpty()
  @IsNumber()
  bookId: number;

  @IsNotEmpty()
  @IsNumber()
  foundAtId: number;
}
