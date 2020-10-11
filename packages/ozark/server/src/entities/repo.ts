import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './user'

@Entity('repository')
export class Repository extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  owner: string

  @Column('varchar')
  name: string

  @Column('varchar')
  secret: string

  @Column('varchar', { nullable: true })
  webhook_url: string

  @Column('int', { default: 3 })
  fails_in_row: number

  @ManyToOne(() => User, (user) => user.id, {
    primary: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User | number

  @Column('varchar', { nullable: true })
  github_access_token: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
