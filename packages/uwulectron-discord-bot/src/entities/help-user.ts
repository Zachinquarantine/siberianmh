import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('help-user')
export class HelpUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  userId: string

  @Column('varchar')
  channelId: string

  @CreateDateColumn()
  created_at: Date
}
