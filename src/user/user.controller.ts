import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /* @Patch(':name')
  update(@Param('name') name: string, @Body() updateUserDto: UpdateUserDto) {
      return this.userService.update(name, updateUserDto);
  }  */

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /* @Get(':name')
  findOne(@Param('name') name: string) {
    return this.userService.findOne(name);
  } */

  @Get('/withFilters')
  findByRequest(@Body() findUserDto: FindUserDto) {
    return this.userService.findByRequest(findUserDto);
  }
  
  /* @Get('/numTask/:name')
  findTasks(@Param('name') name: string){
    return this.userService.findTasks(name);
  }

  @Get('/costTask/:name')
  findCost(@Param('name') name: string){
    return this.userService.findCost(name);
  } */

  /* @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  } */

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
