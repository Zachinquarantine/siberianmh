import * as React from 'react'
import { Button, Text, ButtonPrimary } from '@primer/components'
import { IRepository } from '@ozark/types'
import { api } from '../../lib/api'
import { AddNewRepoDialog } from '../add-new-repo'
import { Link } from 'react-router-dom'
import { Page } from '../page'

type IHomeProps = unknown

interface IHomeState {
  readonly repos: Array<IRepository>

  isAddingNewRepo: boolean
}

export class Home extends React.Component<IHomeProps, IHomeState> {
  public constructor(props: IHomeProps) {
    super(props)

    this.state = {
      repos: null,
      isAddingNewRepo: false,
    }
  }

  public componentDidMount() {
    api.get('/repository').then((res) => {
      this.setState({
        repos: res.data,
      })
    })
  }

  private toggleAddNewRepoDialog = () => {
    this.setState((state) => ({
      isAddingNewRepo: !state.isAddingNewRepo,
    }))
  }

  private renderAddNewRepoDialog = () => {
    const { isAddingNewRepo } = this.state

    if (isAddingNewRepo) {
      return (
        <AddNewRepoDialog
          open={isAddingNewRepo}
          onClose={this.toggleAddNewRepoDialog}
        />
      )
    }
  }

  private renderWelcomeScreen = () => {
    return <div>TODO</div>
  }

  private renderRepositoriesList = () => {
    const { repos } = this.state

    return repos.map((repo) => {
      return (
        <div key={repo.id} className="Box-row">
          <div className="d-flex flex-items-center">
            <span className="overflow-hidden flex-auto">
              <Text>
                {repo.owner}/{repo.name}
              </Text>
              <ButtonPrimary
                style={{ float: 'right' }}
                as={Link}
                to={`/${repo.owner}/${repo.name}`}
              >
                View
              </ButtonPrimary>
            </span>
          </div>
        </div>
      )
    })
  }

  public render() {
    if (!this.state.repos) {
      return null
    }

    const { repos } = this.state

    console.log(repos)

    return (
      <Page>
        <div className="py-8 py-lg-9 py-md-10">
          <div className="container-xl p-responsive">
            <div className="Box Box--condensed">
              <div className="Box-header d-flex flex-items-center">
                <h3 className="Box-title overflow-hidden flex-auto">
                  Repositories
                </h3>
                <Button type="submit" onClick={this.toggleAddNewRepoDialog}>
                  Add new repository
                </Button>
              </div>
              {repos.length
                ? this.renderRepositoriesList()
                : this.renderWelcomeScreen()}
            </div>
          </div>
        </div>
        {this.renderAddNewRepoDialog()}
      </Page>
    )
  }
}
