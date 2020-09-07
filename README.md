# Play MAME

React
WASM
WebRTC


Notes:

keyboard keys https://github.com/emscripten-ports/SDL2/blob/1d03c6824752d71d44c7e7ea3dd28909deda9659/include/SDL_keycode.h
always release(0) after press(1)

```
metal slugs

2p
a -> shoot
s -> jump
q -> bomb
d -> left
f -> down
r -> up
g -> right



SDL keys

pause = JSMAME.sdl_sendkeyboardkey(1, 19)
credit = JSMAME.sdl_sendkeyboardkey(1, 34)
19 -> pause
34 -> credit
35 -> p2.credit
41 -> fuk
60 -> soft_reset?
61 -> palette
64 -> load state
43 -> tab settings
53 -> vol ctrl?

30 -> p1.start
31 -> p2.start

82 -> p1.up
80 -> p1.left
81 -> p1.down
79 -> p1.right
224 -> p1.shoot -> A
226 -> p1.jump -> B
44 -> p1.bomb -> C
225 -> p1.special -> D

21 -> p2.up
7 -> p2.left
9 -> p2.down
10 -> p2.right
4 -> p2.shoot -> A
22 -> p2.jump -> B
20 -> p2.bomb -> C
26 -> p2.special -> D

foo = (i) => {
  JSMAME.sdl_sendkeyboardkey(1, i)
  setTimeout(() => JSMAME.sdl_sendkeyboardkey(0, i), 100)
}

k = 100
for (let i = 70; i < 300; i++) {
  if ([19, 41, 61, 64, 43, 53].includes(i)) {
    continue;
  }
  setTimeout(() => {
    console.log(i)
    foo(i)
  }, i * 1000)
}
```
