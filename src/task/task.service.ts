import { Injectable , NotFoundException} from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import {User} from '../user/entities/user.entity';
import { FindTaskDto } from './dto/find-task.dto';

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
    task.cost = createTaskDto.cost;

  
    const users = await this.userRepository.createQueryBuilder('user')
      .where('user.name IN (:...names)', { names: createTaskDto.users })
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

  /* findByRequest( findtaskDto: FindTaskDto) :  Promise<Task[]>{
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    if (findtaskDto.userName == null || findtaskDto.userEmail == null){
      queryBuilder.leftJoin('user.tasks', 'user')// join with User table if we want a filter related to the user
    }
    queryBuilder.select('*')
     if(FindTaskDto.name ! == null){
      queryBuilder.where('user.name = :name', { name: FindTaskDto.name });
     }
    
    return queryBuilder;
  } */

  async findByRequest(FindTaskDto: FindTaskDto): Promise<Task[]> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    // Conditionally add left join with User table
    if (FindTaskDto.userName != null || FindTaskDto.userEmail != null) {
      queryBuilder.leftJoin('task.users', 'user');
    } 

    // Conditionally add WHERE clause
    if (FindTaskDto.name != null) {
      queryBuilder.where('task.name = :name', { name: FindTaskDto.name });
    }


    if (FindTaskDto.userName !== null) {
      queryBuilder.andWhere('user.name = :userName', { userName: FindTaskDto.userName });
    }
  
    if (FindTaskDto.userEmail !== null) {
      queryBuilder.andWhere('user.email = :userEmail', { userEmail: FindTaskDto.userEmail });
    }
    /* if (FindTaskDto.userName != null) {
      queryBuilder.andWhere('user.name = :userName', { userName: FindTaskDto.userName });
     }
    
    if (FindTaskDto.userEmail != null) { 
      queryBuilder.andWhere('user.email = :userEmail', { userEmail: FindTaskDto.userEmail });
    } */

    //get result
    const tasks = await queryBuilder.getMany();

    //check for results, throw exception if no results are found.
    if (tasks.length === 0) {
      throw new NotFoundException('No tasks found.');
    }

    //return all found Tasks
    return queryBuilder.getMany();
  }
}
