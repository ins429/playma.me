import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CurrentUserContext from 'components/CurrentUserContext'
import MameEmulator from 'components/Emulator'
import PeerConnectionContext, { PeerConnectionProvider } from 'components/Peer'
import Controller from 'components/Controller'
import MonitActivity from 'components/MonitActivity'
import useJoinChannelMutation from 'hooks/mutations/useJoinChannel'
import { showVideoStream } from 'display'
import { canvas } from 'display'

const Channel = () => {
  const [hide, setHide] = useState(false)
  const [message, setMessage] = useState('')
  const [listeningOntrack, setListeningOntrack] = useState(false)
  const { channelName } = useParams()
  const { currentUser } = useContext(CurrentUserContext)
  const [
    joinChannel,
    { data: joinChannelData, loading: joinChannelLoading }
  ] = useJoinChannelMutation()
  const isOwner = currentUser?.id === joinChannelData?.joinChannel?.userId
  const { peerConn, dataChannel } = useContext(PeerConnectionContext)

  useEffect(() => {
    joinChannel(channelName)
  }, [])

  useEffect(() => {
    if (peerConn && !listeningOntrack && joinChannelData?.joinChannel) {
      peerConn.ontrack = ({ streams: [stream, ...streams], ...args }) => {
        console.log('ontrack streams', stream, streams, args)
        if (stream.getAudioTracks()[0]) {
          console.log('audio found')
          const audio = document.querySelector('audio')

          audio.srcObject = stream
          return
        }

        const video = document.querySelector('video')

        if (isOwner) {
          return
        }

        showVideoStream(true)
        setHide(true)

        video.srcObject = stream
      }

      setListeningOntrack(true)
    }
  }, [peerConn, joinChannelData])

  if (!joinChannelData || joinChannelLoading) {
    return null
  }

  return (
    <>
      <div className={`${hide ? 'hidden' : 'h-screen'} flex flex-col p-2`}>
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-xs">
            Connection: <span>{peerConn?.connectionState || 'idle'}</span>
          </p>
          {isOwner ? (
            <MameEmulator
              onStart={() => {
                setHide(true)

                try {
                  const stream = canvas.captureStream()

                  stream.getTracks().forEach(track => {
                    peerConn.addTrack(track, stream)
                  })
                } catch (e) {
                  console.log('err', e)
                }
              }}
            />
          ) : (
            <div className="w-full max-w-xs">
              <p className="bg-white shadow-md rounded px-8 py-6 mb-4">
                Waiting to get started
              </p>
            </div>
          )}
          <div className="flex mb-2 hidden">
            <input
              type="text"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button
              className="flex items-center justify-center ml-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white p-2 border border-blue-500 hover:border-transparent rounded"
              onClick={e => {
                e.preventDefault()

                if (dataChannel.readyState !== 'open') {
                  return
                }

                dataChannel.send(message)
                setMessage('')
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {false && (
        <div>
          <button
            className="flex items-center justify-center ml-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white p-2 border border-blue-500 hover:border-transparent rounded"
            onClick={async e => {
              const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
              })

              const audioTracks = stream.getAudioTracks()

              if (audioTracks.length > 0) {
                console.log(
                  `Using Audio device: ${audioTracks[0].label}`,
                  audioTracks
                )
              }

              stream
                .getTracks()
                .forEach(track => peerConn.addTrack(track, stream))
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
        </div>
      )}
      <div className={`${hide ? 'touch-manipulation' : 'hidden'}`}>
        <Controller dataChannel={isOwner ? null : dataChannel} />
      </div>
      <MonitActivity channelName={channelName} />
    </>
  )
}

export default props => (
  <PeerConnectionProvider>
    <Channel {...props} />
  </PeerConnectionProvider>
)
