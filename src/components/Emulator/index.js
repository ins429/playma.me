import React, { useState } from 'react'
import * as BrowserFS from 'browserfs'
import { FLAG_W, attachScript, loadBrowserFS } from './utils'
import { canvas, showCanvas } from 'display'

let fs = null
loadBrowserFS(_fs => (fs = _fs))

const getSize = () => {
  if (window.innerHeight > 1174 && window.innerWidth > 1024) {
    return 1024
  }

  if (window.innerHeight > 918 && window.innerWidth > 768) {
    return 768
  }

  if (window.innerHeight > 662 && window.innerWidth > 512) {
    return 512
  }

  return window.innerWidth - 10
}

const resizeCanvas = (canvas, size) => {
  // optimizeSpeed is the standardized value. different
  // browsers support different values; they will all ignore
  // values that they don't understand.
  canvas.style.imageRendering = '-moz-crisp-edges'
  canvas.style.imageRendering = '-o-crisp-edges'
  canvas.style.imageRendering = '-webkit-optimize-contrast'
  canvas.style.imageRendering = 'optimize-contrast'
  canvas.style.imageRendering = 'crisp-edges'
  canvas.style.imageRendering = 'pixelated'
  canvas.style.imageRendering = 'optimizeSpeed'

  canvas.style.width = size + 'px'
  canvas.style.height = size + 'px'
  canvas.setAttribute('width', size)
  canvas.setAttribute('height', size)
}

const getResolutionArg = (size = getSize()) => {
  return `${size}x${size}`
}

const start = (canvas, driver, emulatorFilename = 'mameneogeo.js') => {
  resizeCanvas(canvas, getSize())

  console.log('start', emulatorFilename)

  window.Module = {
    arguments: [
      driver,
      '-verbose',
      '-rompath',
      'emulator',
      '-window',
      '-nokeepaspect',
      '-resolution',
      getResolutionArg()
    ],
    screenIsReadOnly: true,
    print: function(text) {
      console.log(text)
    },
    printErr: function(text) {
      console.log(text)
    },
    canvas,
    noInitialRun: false,
    preInit: function() {
      // Re-initialize BFS to just use the writable in-memory storage.
      BrowserFS.initialize(fs)
      var BFS = new BrowserFS.EmscriptenFS()
      // Mount the file system into Emscripten.
      window.FS.mkdir('/emulator')
      window.FS.mount(BFS, { root: '/' }, '/emulator')
    }
  }
  attachScript(`emulators/${emulatorFilename}`)
}

const writeFile = (filename, file) => {
  const reader = new FileReader()
  const Buffer = BrowserFS.BFSRequire('buffer').Buffer

  reader.readAsArrayBuffer(file)
  reader.onload = ({ target: { result: buffer } }) => {
    fs.writeFileSync(`/${filename}`, new Buffer(buffer), null, FLAG_W, 0x1a4)
  }
}

const MameEmulator = ({ children, onStart }) => {
  const [biosFilename, setBiosFileName] = useState('')
  const [gameFilename, setGameFilename] = useState('')
  const [error, setError] = useState(false)

  return (
    <div className="w-full max-w-xs">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={async e => {
          e.preventDefault()

          const formData = new FormData(e.target)

          if (!formData.get('game')?.size) {
            setError(true)
            return
          }

          for (let [name, data] of formData.entries()) {
            if (data instanceof File && data.size) {
              const fileName = formData.get(`${name}_name`)
              console.log('writeFile', name, data, fileName)

              await writeFile(fileName, data)
            }
          }

          showCanvas()
          start(
            canvas,
            formData.get('game_name').split('.zip')[0],
            formData.get('emulator_filename')
          )
          onStart()
        }}
      >
        {error && (
          <p className="text-red-500 text-sm italic my-2">
            Please select a game archive.
          </p>
        )}
        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="emulator_filename"
          >
            Emulator Driver
          </label>
          <div className="relative flex-1 mr-1">
            <div className="nes-select">
              <select name="emulator_filename" defaultValue="mameneogeo.js">
                <option value="mameneogeo.js">Neo-geo</option>
                <option value="mamecps2.js">
                  CPS2 (Capcomp Play System 2)
                </option>
                <option value="mamepsikyosh.js">PSIKYO</option>
                <option value="mamebublbobl.js">bublbobl</option>
                <option value="mametaito_b.js">taito_b</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="bios_name"
          >
            Bios(.zip)
          </label>

          <input
            name="bios_name"
            type="text"
            placeholder="filename"
            className="nes-input mb-4"
            onChange={e => setBiosFileName(e.target.value)}
            value={biosFilename}
          />
          <label class="nes-btn">
            <span>Select a bios</span>
            <input
              name="bios"
              accept=".zip"
              type="file"
              onChange={e => {
                setBiosFileName(e.target?.files[0]?.name || '')
              }}
            />
          </label>
        </div>
        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="game_name"
          >
            Game Archive(.zip)
          </label>
          <input
            name="game_name"
            type="text"
            placeholder="filename"
            className="nes-input mb-4"
            onChange={e => setGameFilename(e.target.value)}
            value={gameFilename}
          />
          <label class="nes-btn">
            <span>Select a game</span>
            <input
              name="game"
              accept=".zip"
              type="file"
              onChange={e => {
                setGameFilename(e.target?.files[0]?.name || '')
              }}
            />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="nes-btn is-primary w-full text-lg text-white font-bold py-2 px-4"
            type="submit"
          >
            start
          </button>
        </div>
      </form>
    </div>
  )
}

export default MameEmulator
