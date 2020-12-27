import { AxiosResponse } from 'axios'
import { GitLab, IGitLabMergeRequest } from 'siberianmh/packages/gitlab-api/src'
import { labels as cqLabels } from '../constants'
import { $TSFixMe } from '../types'

interface ICreateStatusOptions {
  readonly project_id: number
  readonly state: 'pending' | 'running' | 'success' | 'failed' | 'cancelled'
  readonly sha: string
  readonly description?: string
}

export class GitLabProvider {
  private gitty: GitLab

  public constructor() {
    this.gitty = new GitLab({
      hostname: process.env.GITLAB_HOST,
      token: process.env.GITLAB_TOKEN,
    })
  }

  public async getPull(
    opts: $TSFixMe,
  ): Promise<AxiosResponse<IGitLabMergeRequest>> {
    return await this.gitty.mergeRequest.getMergeRequest({
      project_id: opts.project_id,
      merge_request_iid: opts.merge_request_iid,
    })
  }

  public async createStatus(
    opts: ICreateStatusOptions,
  ): Promise<AxiosResponse<any>> {
    return await this.gitty.commits.createCommitStatus({
      project_id: opts.project_id,
      sha: opts.sha,
      state: opts.state,
      context: 'farewell/commit-queue',
    })
  }

  public async getBasedStatus(project_id: number, pr_number: number) {
    const {
      data: { labels },
    } = await this.getPull({
      project_id,
      merge_request_iid: pr_number,
    })

    if (labels.includes(cqLabels.cqPlusOne)) {
      return true
    }

    return false
  }

  public async setBasedStatus(project_id: number, pr_number: number) {
    if (await this.getBasedStatus(project_id, pr_number)) {
      return null
    }

    const data = {
      add_labels: `${cqLabels.cqPlusOne}`,
    }

    console.log(data)

    const { data: updatePR } = await this.gitty.mergeRequest.updateMergeRequest(
      {
        merge_request_iid: pr_number,
        project_id: project_id,
        add_labels: data.add_labels,
      },
    )

    console.log(updatePR)

    return updatePR
  }
}
