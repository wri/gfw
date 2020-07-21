import { createMedia } from '@artsy/fresnel';

export const SCREEN_S = 320;
export const SCREEN_M = 768;
export const SCREEN_L = 1024;
export const SCREEN_XL = 1080;

const ExampleAppMedia = createMedia({
  breakpoints: {
    sm: SCREEN_S,
    md: SCREEN_M,
    lg: SCREEN_L,
    xl: SCREEN_XL,
  },
});

// Make styles for injection into the header of the page
export const mediaStyles = ExampleAppMedia.createMediaStyle();

export const { Media, MediaContextProvider } = ExampleAppMedia;
