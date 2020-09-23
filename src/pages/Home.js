import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Home = () => {
  const [channel, setChannel] = useState('')
  const history = useHistory()

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl text-center align-bottom">Play MAME</h1>
      <form
        className="min-w-280 flex flex-col m-4"
        onSubmit={() => history.push(`/${window.encodeURIComponent(channel)}`)}
      >
        <input
          className="nes-input bg-white text-lg py-2 px-4 mb-2 block w-full"
          aria-label="Channel Name"
          placeholder="Channel Name"
          value={channel}
          onChange={({ target: { value } }) => setChannel(value)}
        />
        <button
          className="nes-btn is-primary w-full text-lg text-white font-bold py-2 px-4"
          aria-label="join"
          type="submit"
          disabled={!channel.trim()}
        >
          Join
        </button>
      </form>
    </div>
  )
}

export default Home
