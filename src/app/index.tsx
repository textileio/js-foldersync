import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { Router, Route, Switch } from 'react-router-dom'
import Root from 'app/containers/Root'
import Start from 'app/containers/Start'
import Finder from 'app/containers/Finder'
import Folder from 'app/containers/Folder'

// render react DOM
export const App = hot(({ history }: any) => (
  <Root>
    <Router history={history}>
      <Switch>
        <Route path='/finder/:id/folder/:id' component={Folder} />
        <Route path='/finder/:id' component={Finder} />
        <Route path='/' component={Start} />
      </Switch>
    </Router>
  </Root>
))
