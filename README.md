# miro-board
Hi there!
It's simple implementation of miro-like board where user can login, add some notes on random places, move them and edit text inside. But cannot do this with other people's cards, only view them.

If you want to test it on your local - `npm i` on frontend, backend and root folders. After that just run `npm run dev` on root directory and enjoy.

## Current stack
- React
- Typescript
- Express
- Socket.io
- Lodash (initially was RxJs, but, meh)

## Future plans
- First of all, deploy current version on some platform.
- Implement smooth notes drag by using some external libs, or create my own method with event debouncing, hm, will think over it.
- Expand note editing (color, size, etc).
- Maybe, add some css framework. Probably Tailwind, but not sure.
