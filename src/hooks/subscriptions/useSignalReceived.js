import gql from "graphql-tag"
import { useSubscription } from "@apollo/react-hooks"

export const SIGNAL_RECEIVED = gql`
  subscription SignalReceivedSubscription($channelName: String!) {
    signalReceived(channelName: $channelName) {
      peerUuid
      channelName
      candidate
      sdp
      type
    }
  }
`

const useSignalReceivedSubscription = channelName =>
  useSubscription(SIGNAL_RECEIVED, {
    variables: { channelName }
  })

export default useSignalReceivedSubscription
