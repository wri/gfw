import makeStore from '../app/store';

const isServer = typeof window === 'undefined';
const NEXT_REDUX_STORE = 'NEXT_REDUX_STORE';

export default function (initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return makeStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[NEXT_REDUX_STORE]) {
    window[NEXT_REDUX_STORE] = makeStore(initialState);
  }
  return window[NEXT_REDUX_STORE];
}
