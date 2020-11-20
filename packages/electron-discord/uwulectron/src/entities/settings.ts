import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('bot-settings')
export class BotSettings extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @PrimaryColumn('varchar', { default: 'electron' })
  name: string

  @Column('boolean', { default: false })
  enable_unfurling: boolean
}
