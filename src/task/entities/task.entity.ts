import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import {User} from '../../user/entities/user.entity';

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 30 })
    name: string;

    @Column({ type: 'varchar', length: 50 })
    description: string;

    @Column({ type: 'int'})
    hours : number;

    @Column({ type: 'varchar', length: 30 })
    status: string;

    @Column ({type: 'timestamp'})
    dueDate: Date;
  
    @Column({ type: 'decimal', precision: 100, scale: 2 })
    cost : number;

    /* @ManyToMany(() => User, (user) => user.tasks)
    @JoinTable()
    users?: User[]; */

    @ManyToMany(
        () => User, 
        user => user.tasks, //optional
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
        @JoinTable({
          name: 'task_user',
          joinColumn: {
            name: 'task_id',
            referencedColumnName: 'id',
          },
          inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
          },
        })
        users?: User[];

}
