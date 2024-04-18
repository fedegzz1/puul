import {
    IsString,
  } from 'class-validator';

  export class UpdateUsersDto {
    @IsString({ each: true })
    users: string[];
  }