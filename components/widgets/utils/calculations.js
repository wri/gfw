export const tonsToTonnes = (value) => value * 0.907185;

export const biomassToCO2 = (value) => value * 0.47;

export const carbonToCO2 = (value) => (value * 12) / 44;

export const agBiomass2agCarbon = (agb) => 0.47 * agb;

export const agBiomass2bgBiomass = (agb) => 0.26 * agb;

export const agBiomass2TotalBiomass = (agb) => 1.26 * agb;

export const agBiomass2bgCarbon = (agb) => 0.47 * 0.26 * agb;

export const agBiomass2TotalCarbon = (agb) => 0.47 * 1.26 * agb;
