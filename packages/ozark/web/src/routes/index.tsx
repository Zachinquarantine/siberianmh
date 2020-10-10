import * as React from 'react'
import { BrowserRouter, Switch, Route as NonAuthRoute } from 'react-router-dom'
import { Route } from '../lib/route'

import { Home } from '../components/home'
import { NotFound } from '../components/not-found'
import { ProjectPage } from '../components/project'
import { SetupProject } from '../components/project/setup'

export const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact={true} component={Home} />
      <Route path="/:owner/:repo" exact={true} component={ProjectPage} />
      <Route path="/:owner/:repo/setup" exact={true} component={SetupProject} />

      <NonAuthRoute path="*" exact={true} component={NotFound} />
    </Switch>
  </BrowserRouter>
)
