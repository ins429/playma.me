import { useEffect, useRef } from 'react'
import useTouchChannelMutation from 'hooks/mutations/useTouchChannel'

const TEN_SECOND = 10000

const MonitActivity = ({ channelName }) => {
  const lastTouchedTime = useRef(new Date().getTime())
  const [touchChannel] = useTouchChannelMutation()

  useEffect(() => {
    const callback = () => {
      const now = new Date().getTime()

      if (now - lastTouchedTime.current > TEN_SECOND) {
        touchChannel(channelName)
        lastTouchedTime.current = now
      }
    }
    document.addEventListener('keypress', callback)
    document.addEventListener('mousemove', callback)

    return () => {
      document.removeEventListener('keypress', callback)
      document.removeEventListener('mousemove', callback)
    }
  }, [])

  return null
}

export default MonitActivity
