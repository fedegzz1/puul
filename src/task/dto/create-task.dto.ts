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

export class CreateTaskDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    @IsInt()
    hours: number;

    @IsString()
    @IsEnum(['activa', 'terminada'], {message: 'Estatus invalido, debe de ser activa o terminada'})
    status: string;

    @IsDate()
    dueDate: Date;

    @IsDecimal()
    cost: number;

    @IsString({ each: true })
    users: string[];

}
