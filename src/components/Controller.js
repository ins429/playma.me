import React, { useEffect } from 'react'

export const sendKey = (key, dataChannel, click = false) => {
  if (dataChannel?.readyState === 'open') {
    dataChannel.send(`ctrl-press:${key}`)
  }

  if (window.JSMAME) {
    window.JSMAME.sdl_sendkeyboardkey(1, key)

    if (click) {
      setTimeout(() => window.JSMAME.sdl_sendkeyboardkey(0, key), 100)
      return
    }
  }

  const releaseHandler = () => {
    if (dataChannel?.readyState === 'open') {
      setTimeout(() => dataChannel.send(`ctrl-release:${key}`), click ? 100 : 0)
    }

    if (window.JSMAME) {
      window.JSMAME.sdl_sendkeyboardkey(0, key)
    }

    document.removeEventListener('mouseup', releaseHandler)
    document.removeEventListener('touchend', releaseHandler)
    document.removeEventListener('keyup', releaseHandler)
  }
  document.addEventListener('mouseup', releaseHandler)
  document.addEventListener('touchend', releaseHandler)
  document.addEventListener('keyup', releaseHandler)
}

const Controller = ({ dataChannel }) => {
  useEffect(() => {
    if (dataChannel) {
      document.addEventListener('keydown', e => {
        if (dataChannel) {
          switch (e.code) {
            case 'ArrowDown':
              sendKey(9, dataChannel)
              break
            case 'ArrowUp':
              sendKey(21, dataChannel)
              break
            case 'ArrowLeft':
              sendKey(7, dataChannel)
              break
            case 'ArrowRight':
              sendKey(10, dataChannel)
              break
            case 'KeyQ':
              sendKey(4, dataChannel)
              break
            case 'KeyW':
              sendKey(22, dataChannel)
              break
            case 'KeyE':
              sendKey(20, dataChannel)
              break
            case 'KeyR':
              sendKey(26, dataChannel)
              break
            default:
              break
          }
        }
      })
    }
  }, [dataChannel])

  return (
    <div className="flex items-center justify-center select-none py-2">
      <div className="inline-block">
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 m-1 rounded focus:outline-none focus:shadow-outline select-none"
            onClick={() => sendKey(dataChannel ? 35 : 34, dataChannel, true)}
          >
            coin
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 m-1 rounded focus:outline-none focus:shadow-outline select-none"
            onClick={() => sendKey(dataChannel ? 31 : 30, dataChannel, true)}
          >
            start
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 m-1 rounded focus:outline-none focus:shadow-outline select-none"
            onClick={() => sendKey(19, dataChannel, true)}
          >
            pause
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-2">
            <div className="flex justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 m-1 rounded focus:outline-none focus:shadow-outline select-none"
                onTouchStart={e => {
                  e.preventDefault()
                  sendKey(dataChannel ? 21 : 82, dataChannel)
                }}
                onMouseDown={e => sendKey(dataChannel ? 21 : 82, dataChannel)}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="arrow-up w-5 h-5 sm:w-6 sm:h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 m-1 rounded focus:outline-none focus:shadow-outline select-none"
                  onTouchStart={e => {
                    e.preventDefault()
                    sendKey(dataChannel ? 7 : 80, dataChannel)
                  }}
                  onMouseDown={() => sendKey(dataChannel ? 7 : 80, dataChannel)}
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="arrow-left w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 m-1 rounded focus:outline-none focus:shadow-outline select-none"
                  onTouchStart={e => {
                    e.preventDefault()
                    sendKey(dataChannel ? 9 : 81, dataChannel)
                  }}
                  onMouseDown={() => sendKey(dataChannel ? 9 : 81, dataChannel)}
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="arrow-down w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 m-1 rounded focus:outline-none focus:shadow-outline select-none"
                  onTouchStart={e => {
                    e.preventDefault()
                    sendKey(dataChannel ? 10 : 79, dataChannel)
                  }}
                  onMouseDown={() =>
                    sendKey(dataChannel ? 10 : 79, dataChannel)
                  }
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="arrow-right w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center ml-2">
            <div className="flex items-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-16 h-16 m-1 rounded-full focus:outline-none focus:shadow-outline"
                onTouchStart={e => {
                  e.preventDefault()
                  sendKey(dataChannel ? 4 : 224, dataChannel)
                }}
                onMouseDown={() => sendKey(dataChannel ? 4 : 224, dataChannel)}
              >
                A
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-16 h-16 m-1 rounded-full focus:outline-none focus:shadow-outline"
                onTouchStart={e => {
                  e.preventDefault()
                  sendKey(dataChannel ? 22 : 226, dataChannel)
                }}
                onMouseDown={() => sendKey(dataChannel ? 22 : 226, dataChannel)}
              >
                B
              </button>
            </div>
            <div className="flex items-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-16 h-16 m-1 rounded-full focus:outline-none focus:shadow-outline"
                onTouchStart={e => {
                  e.preventDefault()
                  sendKey(dataChannel ? 20 : 44, dataChannel)
                }}
                onMouseDown={() => sendKey(dataChannel ? 20 : 44, dataChannel)}
              >
                C
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-16 h-16 m-1 rounded-full focus:outline-none focus:shadow-outline"
                onTouchStart={e => {
                  e.preventDefault()
                  sendKey(dataChannel ? 26 : 225, dataChannel)
                }}
                onMouseDown={() => sendKey(dataChannel ? 26 : 225, dataChannel)}
              >
                D
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Controller
