import { IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { MinLength } from "class-validator";
import { IsArray } from "class-validator";
import { ValidateIf } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @ValidateIf(o => o.password.length > 0)
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsArray()
  roles?: string[];

  @IsOptional()
  @IsNumber()
  locationId?: number;
}
