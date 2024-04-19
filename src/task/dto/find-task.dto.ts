import {
    IsAlphanumeric,
    IsISO8601,
    IsBoolean,
    IsDate,
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

export class FindTaskDto {
    @IsString()
    name: string;

    @IsISO8601()
    dueDate: Date;

    @IsString()
    userName: string;

    @IsEmail()
    userEmail: string;

    @IsString()
    @IsEnum(['active', 'finished'], {message: 'Invalid Status, must be either "active" or "finished"'})
    status: string;

    @IsBoolean()
    sortDesc: boolean;

}
