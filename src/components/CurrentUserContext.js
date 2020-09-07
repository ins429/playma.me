import React, { createContext } from "react"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"

const CurrentUserContext = createContext()

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    user {
      id
      name
      createdAt
    }
  }
`

const SESSION_TOKEN_QUERY = gql`
  query SessionToken {
    sessionToken
  }
`

export const CurrentUserProvider = ({ children }) => {
  const { loading: loadingSessionToken } = useQuery(SESSION_TOKEN_QUERY, {
    onCompleted: ({ sessionToken }) =>
      localStorage.setItem("token", sessionToken)
  })

  const { data: { user: currentUser } = {}, loading, refetch } = useQuery(
    CURRENT_USER_QUERY,
    {
      fetchPolicy: "network-only",
      skip: loadingSessionToken
    }
  )

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        refetch,
        loading: loading || loadingSessionToken
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  )
}

export default CurrentUserContext
