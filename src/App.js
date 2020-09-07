import React from 'react'
import { client } from 'config/apollo'
import { ApolloProvider } from '@apollo/react-hooks'
import { CurrentUserProvider } from 'components/CurrentUserContext'
import Router from './Router'
import './App.css'

const App = () => (
  <ApolloProvider client={client}>
    <CurrentUserProvider>
      <Router />
    </CurrentUserProvider>
  </ApolloProvider>
)

export default App
