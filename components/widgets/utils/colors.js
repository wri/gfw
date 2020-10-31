import chroma from 'chroma-js';

export const getColorPalette = (colorRange, quantity) => {
  const trim = 0.5 / (quantity - 0.6);
  return chroma.scale(colorRange).padding(trim).colors(quantity);
};

export const hslShift = (colorHex) => {
  const [h, s, l] = chroma(colorHex).hsl();

  const hueShift = 0;
  let saturationShift = -0.3;
  let lightnessShift = 0.3;

  if (s < 0.5) {
    saturationShift = 0.3;
    lightnessShift = 0.5;
  } else if (s < 0.75) {
    saturationShift = 0.1;
    lightnessShift = 0.2;
  }

  const new_h = h + hueShift;
  const new_s = s + saturationShift <= 1 ? s + saturationShift : 1;
  const new_l = l + lightnessShift <= 1 ? l + lightnessShift : 1;

  return chroma.hsl(new_h, new_s, new_l).hex();
};
