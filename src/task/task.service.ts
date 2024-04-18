import { Injectable , NotFoundException} from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult, In } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
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

  /* update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.taskRepository.update(id, updateTaskDto);
  } */

  /* async removeUser(id: number, updateUserDto: UpdateUsersDto ){
    const task = await this.taskRepository.findOne({
      where: {
          id: id
      }
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (updateUserDto.users) {
      // Fetch existing users
      await this.taskRepository
        .createQueryBuilder()
        .relation(Task, 'users')
        .of(id)
        .loadMany(); // Load users relation

      const existingUserIds = task.users.map(user => user.name);

      // Determine users to remove
      const userIdsToRemove = existingUserIds.filter(userId => !updateUserDto.users.includes(userId));

      // Load User entities
      const usersToRemoveEntities = await this.userRepository.findBy({ name: In([userIdsToRemove]) });

      // Update many-to-many relationship
      return await this.taskRepository
        .createQueryBuilder()
        .relation(Task, 'users')
        .of(id)
        .remove( usersToRemoveEntities);
    }
  } */

  async removeUser(id: number, name: string): Promise<void> {
    // Load the entities from the database
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['users'] });
    const user = await this.userRepository.findOneBy({name});

    // Check if entities exist
    if (!task || !user) {
      throw new Error('Entity not found');
    }

    // Remove the association
    task.users = task.users.filter((eb) => eb.name !== user.name);

    // Save the changes
    await this.taskRepository.save(task);
  }


  remove(id: number): Promise<{ affected?: number }> {
    return this.taskRepository.delete(id);
  }


  async findByRequest(FindTaskDto: FindTaskDto): Promise<Task[]> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    // Conditionally add left join with User table
    if (FindTaskDto.userName != null || FindTaskDto.userEmail != null) {
      queryBuilder.leftJoin('task.users', 'user');
    } 

    // Conditionally add WHERE clause depending on which fields are populated
    if (FindTaskDto.name != null) {
      queryBuilder.where('task.name = :name', { name: FindTaskDto.name });
    }


    if (FindTaskDto.userName != null) {
      queryBuilder.andWhere('user.name = :userName', { userName: FindTaskDto.userName });
    }
  
    if (FindTaskDto.userEmail != null) {
      queryBuilder.andWhere('user.email = :userEmail', { userEmail: FindTaskDto.userEmail });
    }

    if (FindTaskDto.status != null){
      queryBuilder.andWhere('task.status = :status', {status: FindTaskDto.status})
    }

    if (FindTaskDto.dueDate != null) {
      queryBuilder.andWhere('DATE(task.dueDate) = :dueDate', { dueDate: FindTaskDto.dueDate });
    }

    if (FindTaskDto.sortDesc != null && FindTaskDto.sortDesc == true){
      queryBuilder.addOrderBy('task.dueDate', "DESC")
    }
    else{
      queryBuilder.addOrderBy('task.dueDate', "ASC")
    }



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
