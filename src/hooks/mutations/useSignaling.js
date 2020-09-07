import gql from "graphql-tag"
import { useMutation } from "@apollo/react-hooks"

export const SIGNALING = gql`
  mutation Signaling(
    $peerUuid: String!
    $channelName: String!
    $sdp: String
    $type: String
    $candidate: String
  ) {
    signaling(
      peerUuid: $peerUuid
      channelName: $channelName
      candidate: $candidate
      sdp: $sdp
      type: $type
    ) {
      peerUuid
      channelName
      candidate
      sdp
      type
    }
  }
`

const useSignalingMutation = options => {
  const [mutate, result] = useMutation(SIGNALING, options)

  const signaling = ({ channelName, peerUuid, candidate, sdp, type }) =>
    mutate({
      variables: {
        channelName,
        peerUuid,
        candidate,
        sdp,
        type
      }
    }).catch(e => e)

  return [signaling, result]
}

export default useSignalingMutation
