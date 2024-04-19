import {
    IsAlphanumeric,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
  } from 'class-validator';
  
  
  export class FindUserDto {
    @IsString()
    @MinLength(2, { message: 'Name must have atleast 2 characters.' })
    name: string;

    @IsEmail(null, { message: 'Please provide valid Email.' })
    email: string;
  
    role: string;
  }