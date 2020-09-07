import * as BrowserFS from 'browserfs'

export const FLAG_W = {
  isReadable: () => false,
  isWriteable: () => true,
  isTruncating: () => false,
  isAppendable: () => false,
  isSynchronous: () => false,
  isExclusive: () => false,
  pathExistsAction: () => 0,
  pathNotExistsAction: () => 3
}

export const attachScript = jsUrl => {
  return new Promise((resolve, reject) => {
    let newScript
    const loaded = e => {
      if (e.target === newScript) {
        newScript.removeEventListener('load', loaded)
        newScript.removeEventListener('error', failed)
        resolve()
      }
    }
    const failed = e => {
      if (e.target === newScript) {
        newScript.removeEventListener('load', loaded)
        newScript.removeEventListener('error', failed)
        reject()
      }
    }
    if (jsUrl) {
      var head = document.getElementsByTagName('head')[0]
      newScript = document.createElement('script')
      newScript.addEventListener('load', loaded)
      newScript.addEventListener('error', failed)
      newScript.type = 'text/javascript'
      newScript.src = jsUrl
      head.appendChild(newScript)
    }
  })
}

export const loadBrowserFS = callback => {
  let fs = null

  const AsyncMirrorFS = BrowserFS.FileSystem.AsyncMirror
  const IndexedDB = BrowserFS.FileSystem.IndexedDB

  const finish = deltaFS => {
    fs = new BrowserFS.FileSystem.OverlayFS(
      deltaFS,
      new BrowserFS.FileSystem.MountableFileSystem()
    )
    fs.initialize(function(e) {
      if (e) {
        console.error('Failed to initialize the OverlayFS:', e)
      }
    })
    callback(fs)
  }
  const inMemoryFS = new BrowserFS.FileSystem.InMemory()
  let deltaFS = new AsyncMirrorFS(
    inMemoryFS,
    new IndexedDB(function(e, _fs) {
      if (e) {
        // we probably weren't given access;
        // private window for example.
        // don't fail completely, just don't
        // use indexeddb
        deltaFS = inMemoryFS
        finish(deltaFS)
      } else {
        // Initialize deltaFS by copying files from async storage to sync storage.
        deltaFS.initialize(function(e) {
          if (e) {
            console.log('deltaFS.initialize err', e)
            return
          }
          finish(deltaFS)
        })
      }
    }, 'mame-emulator')
  )
}
