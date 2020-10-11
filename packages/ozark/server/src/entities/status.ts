import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IResult, Provider } from '@ozark/types'
import { Repository } from './repo'

@Entity('repo_job')
export class RepoJobs extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  name: string

  @Column('varchar')
  provider: Provider

  @ManyToOne(() => Repository, (repo) => repo.id, {
    primary: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  repository: Repository | number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

@Entity('repo_jobs_runs')
export class RepoJobsRuns extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('int', { nullable: false, primary: true })
  run_id: number

  @Column('int')
  job_id: RepoJobs | number

  @ManyToOne(() => Repository, (repo) => repo.id, {
    primary: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  repository: Repository | number

  @Column('varchar')
  sha: string

  @Column('varchar')
  provider: Provider

  @Column('varchar')
  result: IResult

  @Column('varchar', { nullable: true })
  branch: string

  @Column('varchar', { nullable: true })
  html_url: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
