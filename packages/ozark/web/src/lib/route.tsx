import * as React from 'react'
import {
  RouteProps as IRouteProps,
  Route as RouteWrapper,
} from 'react-router-dom'
import { api } from './api'
import { NeedAuthentication } from '../components/need-authentication'
import type { IUser } from '@ozark/types'

interface IRouteState {
  readonly data: { status: number } | IUser
}

export class Route extends React.PureComponent<IRouteProps, IRouteState> {
  public componentDidMount() {
    api.get('/users/me').then((res) => {
      this.setState({
        data: res.data,
      })
    })
  }

  public renderRoute = (routeProps: IRouteProps) => {
    const { component } = this.props

    if (!this.state) {
      return null
    }

    // @ts-expect-error
    if (this.state.data.status === 403) {
      return <NeedAuthentication />
    }

    const Component = component

    // @ts-expect-error
    return <Component {...routeProps} />
  }

  public render() {
    // eslint-disable-next-line
    const { component, ...rest } = this.props
    return <RouteWrapper {...rest} render={this.renderRoute}></RouteWrapper>
  }
}
