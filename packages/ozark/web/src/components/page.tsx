import * as React from 'react'
import { Header } from './header'
import { Helmet } from 'react-helmet'

interface IPageProps {
  readonly children: React.ReactNode

  readonly title?: string
}

export class Page extends React.Component<IPageProps> {
  public render() {
    return (
      <>
        <Helmet>
          <title>{this.props.title}</title>
        </Helmet>

        <Header />

        {this.props.children}
      </>
    )
  }
}
