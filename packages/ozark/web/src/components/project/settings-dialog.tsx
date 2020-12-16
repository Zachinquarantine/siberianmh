import * as React from 'react'
import { useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  ButtonPrimary,
  Flash,
  Dialog,
  StyledOcticon,
  Text,
  TextInput,
  Tooltip,
} from '@primer/components'
import { CheckIcon, InfoIcon } from '../icons'
import { api } from '../../lib/api'
import type { IRepository } from '@ozark/types'

interface IProjectSettingsDialogProps {
  readonly open: boolean
  readonly onClose: () => void
  readonly repoInfo: IRepository
}

export const ProjectSettingsDialog = ({
  open,
  onClose,
  repoInfo,
}: IProjectSettingsDialogProps) => {
  console.log(repoInfo)
  const [failsInRow, setFailsInRow] = useState(repoInfo.fails_in_row)
  const [webhookURL, setWebhookURL] = useState(repoInfo.webhook_url ?? '')
  const [githubToken, setGitHubToken] = useState(
    repoInfo.github_access_token ?? '',
  )
  const [showFlash, setShowFlash] = useState(false)

  const onFailsInRowChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFailsInRow(parseInt(event.target.value, 10))
  }

  const onWebhookChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookURL(event.target.value)
  }

  const onGHTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGitHubToken(event.target.value)
  }

  const onSubmit = async () => {
    const { data } = await api.patch(`/repository/${repoInfo.name}`, {
      webhook_url: webhookURL,
      github_token: githubToken,
      fails_in_row: failsInRow,
    })

    if (data.status === 200) {
      setShowFlash(true)
    }
  }

  return (
    <Dialog isOpen={open} onDismiss={onClose}>
      <Dialog.Header>Settings</Dialog.Header>
      <div>
        {showFlash && (
          <Flash variant="success">
            <StyledOcticon icon={CheckIcon} />
            Repository settings successfully updated.
          </Flash>
        )}
        <Box p={4}>
          <Box my={2}>
            <Text as="p" fontWeight={600}>
              Fails in a row{' '}
              <Tooltip aria-label="How many time should job failed before report back">
                <StyledOcticon icon={InfoIcon} />
              </Tooltip>
            </Text>
            <TextInput
              block={true}
              placeholder="Fails in a row"
              value={failsInRow}
              onChange={onFailsInRowChanged}
            />
          </Box>

          <Box my={2}>
            <Text as="p" fontWeight={600}>
              Webhook URL{' '}
              <Tooltip aria-label="Supports Discord and Slack">
                <StyledOcticon icon={InfoIcon} />
              </Tooltip>
            </Text>
            <TextInput
              block={true}
              placeholder="Webhook URL"
              value={webhookURL}
              onChange={onWebhookChange}
            />
          </Box>

          <Box>
            <Text as="p" fontWeight={600}>
              GitHub Personal Access Token
            </Text>
            <TextInput
              block={true}
              placeholder="GitHub Personal Access Token"
              value={githubToken}
              onChange={onGHTokenChange}
            />
          </Box>

          <Box my={2}>
            <Text as="p" fontWeight={600}>
              Repository Secret
            </Text>
            <TextInput block={true} disabled={true} value={repoInfo.secret} />
          </Box>
        </Box>

        <ButtonGroup p={2}>
          <Button onClick={onClose}>Cancel</Button>
          <ButtonPrimary onClick={onSubmit}>Submit</ButtonPrimary>
        </ButtonGroup>
      </div>
    </Dialog>
  )
}
