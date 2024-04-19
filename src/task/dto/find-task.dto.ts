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
    IsOptional,
  } from 'class-validator';

export class FindTaskDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsISO8601()
    @IsOptional()
    dueDate: Date;

    @IsString()
    @IsOptional()
    userName: string;

    @IsEmail()
    @IsOptional()
    userEmail: string;

    @IsString()
    @IsOptional()
    @IsEnum(['active', 'finished'], {message: 'Invalid Status, must be either "active" or "finished"'})
    status: string;

    @IsBoolean()
    @IsOptional()
    sortDesc: boolean;

}
