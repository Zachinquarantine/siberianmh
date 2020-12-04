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

  @Column('varchar', { unique: true })
  userId: string

  @Column('varchar')
  channelId: string

  @Column('varchar', { nullable: true })
  messageId: string

  @CreateDateColumn()
  created_at: Date
}
