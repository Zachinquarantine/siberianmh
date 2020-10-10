import * as React from 'react'
import styled from 'styled-components'
import BGImg from '../assets/not-found.jpg'
import { Header } from './header'

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
  z-index: 0;
  background: linear-gradient(to bottom, #1c1a2ddd 75%, #1a1a2d 100%),
    url(${BGImg}) no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
`

export const NotFound = () => {
  return (
    <Wrapper>
      <Background />
      <Header isEngaged={true} />
    </Wrapper>
  )
}
