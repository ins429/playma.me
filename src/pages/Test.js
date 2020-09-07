import React, { useState } from 'react'
import MameEmulator from 'components/Emulator'

const App = () => {
  const [hide, setHide] = useState(false)

  return (
    <div className={hide ? 'hidden' : 'h-screen'}>
      <div className="flex flex-col h-full">
        <div className="flex flex-1 items-center justify-center">
          <MameEmulator onStart={() => setHide(true)} />
        </div>
      </div>
    </div>
  )
}

export default App
