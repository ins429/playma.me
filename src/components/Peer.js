import React, { createContext, useEffect, useState, useRef } from 'react'
import isEqual from 'lodash.isequal'
import useSignalingMutation from 'hooks/mutations/useSignaling'
import useSignalReceivedSubscription from 'hooks/subscriptions/useSignalReceived'
import { handleControlMessage } from 'utils'

const PeerConnectionContext = createContext()

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const iceConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: process.env.REACT_APP_TURN_URI,
      credential: 'test',
      username: 'test'
    }
  ]
}

const deepCompareEquals = (a, b) => isEqual(a, b)

const useDeepCompareMemoize = value => {
  const ref = useRef()

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

const useDeepCompareEffect = (callback, dependencies) => {
  useEffect(callback, useDeepCompareMemoize(dependencies))
}

export const PeerConnectionProvider = ({
  children,
  polite = true,
  dataChannelName = 'test'
}) => {
  const [, _update] = useState(0)
  const [peerUuid] = useState(uuidv4())
  const [signaling] = useSignalingMutation()
  const { data } = useSignalReceivedSubscription('wat')
  const [peerConn, setPeerConn] = useState(null)
  const [dataChannel, setDataChannel] = useState(null)
  const [messages, setMessages] = useState([])
  const makingOffer = useRef(false)
  const ignoreOffer = useRef(false)
  const update = () => _update(new Date().getTime())
  const createOffer = async pc => {
    try {
      makingOffer.current = true
      const offer = await pc.createOffer()
      if (pc.signalingState !== 'stable') return
      await pc.setLocalDescription(offer)

      signaling({
        peerUuid,
        channelName: 'wat',
        sdp: offer.sdp,
        type: offer.type
      })
    } catch (e) {
      console.log(`Err: createOffer ${e}`)
    } finally {
      makingOffer.current = false
    }
  }

  const handleData = async data => {
    try {
      if (data?.signalReceived?.type) {
        const offerCollision =
          data?.signalReceived?.type === 'offer' &&
          (makingOffer.current || peerConn.signalingState !== 'stable')

        ignoreOffer.current = !polite && offerCollision

        if (ignoreOffer.current) {
          return
        }

        if (offerCollision) {
          console.log('offerCollision', data.signalReceived)
          await Promise.all([
            peerConn.setLocalDescription({ type: 'rollback' }),
            peerConn.setRemoteDescription(
              new RTCSessionDescription({
                sdp: data.signalReceived.sdp,
                type: data.signalReceived.type
              })
            )
          ])
        } else {
          console.log('offerCollision not', data.signalReceived, peerConn)
          await peerConn.setRemoteDescription(
            new RTCSessionDescription({
              sdp: data.signalReceived.sdp,
              type: data.signalReceived.type
            })
          )
        }

        if (data?.signalReceived?.type === 'offer') {
          console.log('offer received creating answer')
          await peerConn.setLocalDescription(await peerConn.createAnswer())

          const answer = peerConn.localDescription
          console.log('signaling', answer.type)
          signaling({
            peerUuid,
            channelName: 'wat',
            sdp: answer.sdp,
            type: answer.type
          })
        }
      } else if (data?.signalReceived?.candidate) {
        try {
          await peerConn.addIceCandidate(
            JSON.parse(data.signalReceived.candidate)
          )
        } catch (e) {
          if (!ignoreOffer.current) console.log(e)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const pc = new RTCPeerConnection(iceConfiguration)
    const dc = pc.createDataChannel(dataChannelName)

    setPeerConn(pc)
    setDataChannel(dc)

    dc.addEventListener('open', event => {
      console.log('dataChannel open', event)
    })

    dc.addEventListener('message', e => {
      console.log('message', e)
    })

    pc.addEventListener('datachannel', e => {
      console.log('ondatachannel', e)
      const receiveChannel = e.channel
      receiveChannel.onmessage = e => {
        // connectionState
        console.log('message received', e)
        handleControlMessage(e.data)
      }
    })

    pc.onconnectionstatechange = e => {
      if (
        e.srcElement.connectionState === 'failed' ||
        e.srcElement.connectionState === 'disconnected' ||
        e.srcElement.connectionState === 'closed'
      ) {
        // retry
        createOffer(pc)
      }

      update()
    }

    pc.onicecandidate = ({ candidate }) => {
      console.log('candidate', candidate)
      if (candidate) {
        console.log('signaling', 'candidate')
        signaling({
          peerUuid,
          channelName: 'wat',
          candidate: JSON.stringify(candidate.toJSON())
        })
      }
    }

    pc.onnegotiationneeded = async () => {
      console.log('onnegotiationneeded creating offer')
      createOffer(pc)
    }
  }, [])

  useDeepCompareEffect(() => {
    if (data?.signalReceived?.peerUuid === peerUuid) {
      return
    }

    handleData(data)
  }, [data])

  return (
    <PeerConnectionContext.Provider
      value={{
        peerConn,
        dataChannel,
        messages
      }}
    >
      {children}
    </PeerConnectionContext.Provider>
  )
}

export default PeerConnectionContext
