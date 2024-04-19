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

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['users'] });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const { users: userNames, ...taskData } = updateTaskDto;

    if (userNames) {
      // Find users by their names
      const users = await Promise.all(userNames.map(userName =>
        this.userRepository.findOne({ where: { name: userName } })
      ));

      if (users.some(user => !user)) {
        throw new NotFoundException('One or more users not found');
      }

      task.users = users; // Update the users associated with the task
    }

    // Update the task data
    Object.assign(task, taskData);

    return this.taskRepository.save(task); // Save the updated task
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

  async removeUser(id: number, name: string): Promise<string> {
    // Load the entities from the database
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['users'] });
    const user = await this.userRepository.findOne({where: {name}});

    // Check if entities exist
    if (task == null|| user == null) {
      throw new NotFoundException('Entity not found');
    }

    const isUserAssociated = task.users.some((taskUser) => taskUser.name === name);

    if (!isUserAssociated) {
        throw new NotFoundException('User is not associated with the task');
    }

    // Remove the association
    task.users = task.users.filter((eb) => eb.name !== user.name);

    // Save the changes
    await this.taskRepository.save(task);

    return 'Deleted relation between task and user';
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
      queryBuilder.addOrderBy('task.dueDate', "DESC");
    }
    else{
      queryBuilder.addOrderBy('task.dueDate', "ASC");
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

  remainingHours(){
    this.taskRepository.createQueryBuilder
  }

  async calculateRemainingHours(): Promise<number> {
    // Using QueryBuilder to sum remaining hours of active tasks
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    const remainingHours = await queryBuilder
      .select('SUM(task.hours)', 'totalRemainingHours')
      .where('task.status = :status', { status: 'activa' })
      .getRawOne();

    return remainingHours.totalRemainingHours || 0;
  }

  async findTop10TasksWithHighestCostToHoursRatio(numResults: number): Promise<Task[]> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    const top10Tasks = await queryBuilder
      .select('task')
      .addSelect('task.cost / task.hours', 'costToHoursRatio')
      .where('task.status = :status', { status: 'activa' })
      .orderBy('task.cost / task.hours', 'DESC')
      .take(numResults)
      .getRawMany();

    return top10Tasks;
  }
}
