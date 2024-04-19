import {
    IsAlphanumeric,
    IsDateString,
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
    @IsEnum(['active', 'finished'], {message: 'Invalid Status, must be either "active" or "finished"'})
    status: string;

    @IsDateString()
    dueDate: Date;

    @IsDecimal()
    cost: number;

    @IsString({ each: true })
    users: string[];

}
