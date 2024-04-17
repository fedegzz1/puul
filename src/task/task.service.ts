import { Injectable } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import {User} from '../user/entities/User.entity';

@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(Task) 
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>

  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const task: Task = new Task();
    task.name = createTaskDto.name;
    task.description = createTaskDto.description;
    task.hours = createTaskDto.hours;
    task.status = createTaskDto.status;
    task.dueDate = createTaskDto.dueDate;

  
    const users = await this.userRepository.createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids: createTaskDto.users })
      .getMany();


      task.users = users;
    return this.taskRepository.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  findOne(name: string) : Promise<Task> {
    return this.taskRepository.findOneBy({name});
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number): Promise<{ affected?: number }> {
    return this.taskRepository.delete(id);
  }
}
