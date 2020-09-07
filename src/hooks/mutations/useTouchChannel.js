import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

export const TOUCH_CHANNEL = gql`
  mutation TouchChannel($channelName: String!) {
    touchChannel(channelName: $channelName) {
      id
      name
      userId
      users {
        id
        name
      }
    }
  }
`

const useJoinChannelMutation = options => {
  const [mutate, result] = useMutation(TOUCH_CHANNEL, options)

  const touchChannel = channelName =>
    mutate({
      variables: {
        channelName
      }
    })

  return [touchChannel, result]
}

export default useJoinChannelMutation
