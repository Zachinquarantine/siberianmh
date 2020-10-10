import * as React from 'react'
import { Dialog, Flex, TextInput, Box, Button, Text } from '@primer/components'
import { api } from '../../lib/api'
import Fuse from 'fuse.js'
import { $TSFixMe } from '@ozark/types'

interface IAddNewRepoDialogProps {
  readonly open: boolean
  readonly onClose: () => void
}

interface IAddNewRepoDialogState {
  readonly data: $TSFixMe
  readonly searchedData: Fuse.FuseResult<$TSFixMe>[] | null
  readonly isLoading: boolean
}

export class AddNewRepoDialog extends React.Component<
  IAddNewRepoDialogProps,
  IAddNewRepoDialogState
> {
  private fuseInstance: Fuse<$TSFixMe> | null = null

  public constructor(props: IAddNewRepoDialogProps) {
    super(props)

    this.state = {
      data: null,
      searchedData: null,
      isLoading: true,
    }
  }

  public componentDidMount() {
    api.get('/users/gh/repos').then((res) => {
      this.setState({
        data: res.data,
        isLoading: false,
      })
    })
  }

  private renderSpinner = () => {
    return <div>Loading...</div>
  }

  private onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.fuseInstance) {
      const searched = this.fuseInstance.search(event.currentTarget.value)

      this.setState({
        searchedData: searched,
      })
    }
  }

  private renderRepoList = () => {
    const { data, searchedData } = this.state

    this.fuseInstance = new Fuse(data, {
      keys: ['owner.login', 'name'],
    })

    let output

    if (searchedData?.length) {
      output = searchedData.filter((item) => item.item)
    } else {
      output = data
    }

    return (
      <>
        <TextInput
          onChange={this.onSearch}
          block={true}
          placeholder="Search the repository"
        />
        <Flex flexDirection="column">
          {output.map((repo: $TSFixMe) => {
            return (
              <Box pt={3} key={repo.id}>
                <Text>
                  {repo.owner.login}/{repo.name}
                </Text>
                <Button
                  style={{ float: 'right' }}
                  onClick={() => this.onClick(repo)}
                >
                  Add
                </Button>
              </Box>
            )
          })}
        </Flex>
      </>
    )
  }

  private onClick = (repo: $TSFixMe) => {
    const {
      name,
      owner: { login },
    } = repo

    api
      .post('/repository', {
        owner: login,
        name: name,
      })
      .then((res) => {
        if (res.status === 200) {
          window.location.href = `/${res.data.owner}/${res.data.name}/setup`
        }
      })
  }

  public render() {
    const { isLoading } = this.state

    return (
      <Dialog isOpen={this.props.open} onDismiss={this.props.onClose}>
        <Dialog.Header>Add new repository</Dialog.Header>
        <Box p={3}>
          {isLoading ? this.renderSpinner() : this.renderRepoList()}
        </Box>
      </Dialog>
    )
  }
}
