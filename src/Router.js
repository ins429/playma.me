import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import HomePage from 'pages/Home'
import ChannelPage from 'pages/Channel'
import TestPage from 'pages/Test'

const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/test" component={TestPage} />
      <Route path="/:channelName" component={ChannelPage} />
    </Switch>
  </Router>
)

export default AppRouter
