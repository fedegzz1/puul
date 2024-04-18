import {
    IsAlphanumeric,
    IsDate,
    IsDecimal,
    IsEmail,
    IsEnum,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
  } from 'class-validator';

export class FindTaskDto {
    @IsString()
    name: string;

    @IsDate()
    dueDate: Date;

    @IsString()
    userName: string;

    @IsEmail()
    userEmail: string;

    @IsString()
    @IsEnum(['activa', 'terminada'], {message: 'Estatus invalido, debe de ser activa o terminada'})
    status: string;

}
