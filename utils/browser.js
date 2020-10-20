const isServer = typeof window === 'undefined';

export const isTouch = () => !isServer && 'ontouchstart' in window;
