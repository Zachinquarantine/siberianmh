import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'

@Entity('help-user')
export class HelpUser extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { unique: true })
  user_id: string

  @Column('varchar')
  channel_id: string

  @Column('varchar')
  message_id: string

  @CreateDateColumn()
  created_at: Date
}
