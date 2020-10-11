import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Avatar } from '@primer/components'
import styled from 'styled-components'
import OzarkLogo from '../assets/ozark-logo.png'
import { UserState } from '../lib/user'

interface IHeaderProps {
  readonly engaged: boolean
}

const HeaderWrapper = styled.div<IHeaderProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100vw;
  height: 60px;
  box-sizing: border-box;
  padding-left: 17.5%;
  padding-right: 17.5%;
  backdrop-filter: ${(props) => props.engaged && 'blur(5px)'};
  top: 0;
  border-bottom: ${(props) =>
    props.engaged && '1px solid rgba(255, 255, 255, 0.1)'};
  transition: border-bottom 150ms ease 0s, top 250ms ease 0s,
    background-color 300ms ease 0s;
  z-index: 2;

  img {
    width: 32px;
    height: 32px;
  }
`

const AvatarMenu = styled.div`
  float: right;
  margin-left: auto;
`

export const Header = ({ isEngaged }: { isEngaged?: boolean }) => {
  const [engaged, setEngaged] = useState(isEngaged ?? false)
  const user = useContext(UserState)

  useEffect(() => {
    const setFromEvent = () => setEngaged(window.scrollY > 99)
    window.addEventListener('scroll', setFromEvent)

    return () => {
      window.removeEventListener('scroll', setFromEvent)
    }
  }, [])

  return (
    <HeaderWrapper engaged={engaged}>
      <a href="/">
        <img alt="Ozark Logotype" src={OzarkLogo} />
      </a>

      <AvatarMenu>
        {/* @ts-expect-error */}
        <Avatar src={user?.avatar_url} />
      </AvatarMenu>
    </HeaderWrapper>
  )
}
