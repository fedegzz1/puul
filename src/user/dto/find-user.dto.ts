import {
    IsAlphanumeric,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MinLength,
  } from 'class-validator';
  
  
  export class FindUserDto {
    @IsString()
    @MinLength(2, { message: 'Name must have atleast 2 characters.' })
    @IsOptional()
    name: string;

    @IsEmail()
    @IsOptional()
    email: string;
  
    @IsOptional()
    role: string;
  }