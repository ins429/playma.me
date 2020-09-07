import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Home = () => {
  const [channel, setChannel] = useState('')
  const history = useHistory()

  return (
    <div className="h-screen flex flex-col items-center  justify-content">
      <form
        className="min-w-280 flex-1 flex flex-col items-center justify-center m-4"
        onSubmit={() => history.push(`/${window.encodeURIComponent(channel)}`)}
      >
        <input
          className="bg-white text-lg focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 mb-2 block w-full appearance-none leading-normal"
          aria-label="Channel Name"
          placeholder="Channel Name"
          value={channel}
          onChange={({ target: { value } }) => setChannel(value)}
        />
        <button
          className="w-full text-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
