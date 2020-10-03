import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { MergeMethods, Provider } from '../lib/types'

@Entity('pull_request')
export class PullRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { nullable: false })
  owner: string

  @Column('varchar', { nullable: false })
  repository: string

  @Column('int')
  pr_number: number

  @Column('boolean', { nullable: true })
  mergeable: boolean

  @Column('varchar')
  html_url: string

  @Column('varchar', { nullable: false, default: 'open' })
  state: string

  @Column('varchar')
  branch: string

  @Column('varchar', { nullable: false, default: 'squash' })
  merge_method: MergeMethods

  @Column('varchar', { nullable: false })
  provider: Provider
}
