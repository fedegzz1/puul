import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { FindTaskDto } from './dto/find-task.dto'

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  

  @Get('/byname/:name')
  findOne(@Param('name') name: string) {
    return this.taskService.findOne(name);
  }

 /* @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  } */

  /* @Patch('/removeUser/:id')
  update(@Param('id') id: number, @Body() updateUsersDto: UpdateUsersDto) {
    return this.taskService.removeUser(id, updateUsersDto );
  } */

  @Patch('/removeUser/:id/:userName')
  update(@Param('id') id: number, userName: string) {
    return this.taskService.removeUser(id, userName );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }

  @Get('/withFilters')
  findByRequest(@Body() findtaskDto: FindTaskDto) {
    return this.taskService.findByRequest(findtaskDto);
  }
}
