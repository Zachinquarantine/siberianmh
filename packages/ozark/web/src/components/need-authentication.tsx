import * as React from 'react'
import styled from 'styled-components'
import { Box, Button, StyledOcticon } from '@primer/components'
import { MarkGithubIcon } from '@primer/octicons-react'
import BGImg from '../assets/non-log-bg.jpg'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #1c1a2d;
  display: flex;
  flex-direction: column;
  align-items: center;

  body {
    margin: 0;
  }
`

const Background = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  background-image: linear-gradient(to bottom, #1c1a2ddd 75%, #1c1a2d 100%),
    url(${BGImg});
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 65%;
  z-index: 1;

  align-items: center;
  padding-top: 450px;
  margin: 0 auto;
  text-align: center;
  flex-shrink: 0;
`

export const NeedAuthentication = () => {
  const handleGHAuth = () => {
    window.location.href = '/api/login'
  }

  return (
    <Wrapper>
      <Background />

      <Content>
        <Box>
          <Button onClick={handleGHAuth}>
            <StyledOcticon icon={MarkGithubIcon} /> Login via GitHub
          </Button>
        </Box>
      </Content>
    </Wrapper>
  )
}
