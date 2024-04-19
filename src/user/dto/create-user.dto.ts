import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
  } from 'class-validator';
  
  
  export class CreateUserDto {
    @IsString()
    @MinLength(2, { message: 'Name must have atleast 2 characters.' })
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsEnum(['admin', 'member'], {message: 'Invalid role, must be either "admin" or "member"'})
    role: string;
  }