import * as React from 'react'
import {
  Button,
  Flex,
  StyledOcticon,
  Box,
  Text,
  Heading,
  SideNav,
} from '@primer/components'
import { GearIcon, MarkGithubIcon, CheckIcon } from '@primer/octicons-react'
import { RouteComponentProps } from 'react-router-dom'
import { api } from '../../lib/api'
import { ProjectSettingsDialog } from './settings-dialog'
import { $TSFixMe } from '@ozark/types'
import type { IRepository, IJobby, IJobStatus } from '@ozark/types'
import { Page } from '../page'

type IProjectPageProps = RouteComponentProps<{ owner: string; repo: string }>

interface IProjectPageState {
  readonly jobs: Array<IJobby>
  readonly jobsStatuses: Array<IJobStatus>
  readonly repoInfo: IRepository

  readonly selectedJob: $TSFixMe

  isProjectSettings: boolean
}

export class ProjectPage extends React.Component<
  IProjectPageProps,
  IProjectPageState
> {
  public constructor(props: IProjectPageProps) {
    super(props)

    this.state = {
      jobs: null,
      jobsStatuses: null,
      repoInfo: null,

      selectedJob: null,
      isProjectSettings: false,
    }
  }

  public componentDidMount() {
    const {
      match: {
        params: { owner, repo },
      },
    } = this.props

    api.get(`/status/${owner}/${repo}`).then((res) => {
      this.setState({
        jobs: res.data,
      })
    })

    api.get(`/repository/${owner}/${repo}`).then((res) => {
      this.setState({
        repoInfo: res.data,
      })
    })

    api.get(`/status/${owner}/${repo}/status`).then((res) => {
      this.setState({
        jobsStatuses: res.data,
      })
    })
  }

  private getIconForJob = (job: IJobby) => {
    if (job.provider === 'github') {
      return <StyledOcticon icon={MarkGithubIcon} mr={2} />
    }

    return null
  }

  private renderCategory = () => {
    const { jobsStatuses, jobs } = this.state

    const selected = jobs.filter((job) => this.state.selectedJob === job.name)
    const filtered = jobsStatuses.filter(
      (job) => selected[0]?.name === this.state.selectedJob,
    )

    const statuses = filtered.length ? filtered : jobsStatuses

    const getIconForResult = (result: string) => {
      switch (result) {
        case 'failure':
          return <StyledOcticon icon={CheckIcon} color="red.5" />
        case 'success':
          return <StyledOcticon icon={CheckIcon} color="green.5" />
      }
    }

    return (
      <div className="pl-4" style={{ width: '75%' }}>
        <div className="Box Box--condensed">
          <div className="Box-header d-flex flex-items-center">
            <h3 className="Box-title overflow-hidden flex-auto">All jobs</h3>
          </div>
          {statuses.map((status) => {
            console.log(status)
            return (
              <Box m={2} key={status.id}>
                <Flex flexDirection="row">
                  <Box>
                    <Text mr={1} as="span">
                      {status.run_id}
                    </Text>
                    {getIconForResult(status.result)}
                    <Text ml={2}>
                      <a
                        href={status.html_url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {status.html_url}
                      </a>{' '}
                      - {status.sha}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            )
          })}
        </div>
      </div>
    )
  }

  private showCategory = (name: string | null) => {
    this.setState({
      selectedJob: name,
    })
  }

  private toggleProjectSettingsDialog = () => {
    this.setState((state) => ({
      isProjectSettings: !state.isProjectSettings,
    }))
  }

  private renderSettings = () => {
    const { isProjectSettings, repoInfo } = this.state

    if (isProjectSettings) {
      return (
        <ProjectSettingsDialog
          open={isProjectSettings}
          onClose={this.toggleProjectSettingsDialog}
          repoInfo={repoInfo}
        />
      )
    }
  }

  private renderJobs = (jobs: any) => {
    return jobs.map((job: any) => {
      const selected = job.name === this.state.selectedJob

      return (
        <SideNav.Link
          key={job.id}
          as={'button'}
          onClick={() => this.showCategory(job.name)}
          selected={selected}
        >
          {this.getIconForJob(job)}
          <Text>{job.name}</Text>
        </SideNav.Link>
      )
    })
  }

  private renderNoJobs = () => {
    return <div>Nothing here for now</div>
  }

  private renderSidebar = () => {
    const {
      match: {
        params: { owner, repo },
      },
    } = this.props

    const { jobs } = this.state

    return (
      <SideNav>
        <Box mb={2} pb={1}>
          <Heading as="h4" fontSize={1} color="gray.7">
            {owner}/{repo}
            <Button ml={2} onClick={this.toggleProjectSettingsDialog}>
              <StyledOcticon icon={GearIcon} />
            </Button>
          </Heading>
        </Box>
        <SideNav.Link
          as={'button'}
          onClick={() => this.showCategory(null)}
          selected={this.state.selectedJob === null}
        >
          All jobs
        </SideNav.Link>
        {!jobs.length ? this.renderNoJobs() : this.renderJobs(jobs)}
      </SideNav>
    )
  }

  public render() {
    const {
      match: {
        params: { owner, repo },
      },
    } = this.props

    if (!this.state.jobs || !this.state.jobsStatuses) {
      return null
    }

    console.log('JOBS Statuses', this.state.jobsStatuses)

    return (
      <Page title={`${owner}/${repo}`}>
        <div className="py-10 py-lg-11 py-md-12">
          <div className="container-xl p-responsive">
            <Flex flexDirection="row">
              {this.renderSidebar()}
              {this.renderCategory()}
            </Flex>
          </div>
        </div>
        {this.renderSettings()}
      </Page>
    )
  }
}
