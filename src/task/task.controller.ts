import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTaskDto } from './dto/find-task.dto';

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

  

 @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Patch('/removeUser/:id/:userName')
  removeUser(@Param('id') id: number, userName: string) {
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

  @Get('/analytics/remainingHours')
  calculateRemainingHours(){
    return this.taskService.calculateRemainingHours();
  }

  @Get('/analytics/costToHourRatio/:numResults')
  findTop10TasksWithHighestCostToHoursRatio(@Param('numResults') numResults: number){
    return this.taskService.findTop10TasksWithHighestCostToHoursRatio(numResults);
  }
}
