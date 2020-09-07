export const handleControlMessage = message => {
  if (!window.JSMAME) {
    return
  }

  const key = parseInt(message.split(':')[1]) || 0
  console.log('key', key)

  if (!key) {
    return
  }

  console.log('handleControlMessage', message)
  if (message.startsWith('ctrl-press:')) {
    window.JSMAME.sdl_sendkeyboardkey(1, key)
  }

  if (message.startsWith('ctrl-release:')) {
    window.JSMAME.sdl_sendkeyboardkey(0, key)
  }
}
