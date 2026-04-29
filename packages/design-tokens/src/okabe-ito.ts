/**
 * Okabe-Ito 8-color palette (Wong 2011, Nature Methods).
 * Safe under deuteranopia/protanopia/tritanopia simulation.
 *
 * Used as a fallback palette when the user enables color-blind mode.
 */
export const okabeIto = {
  black: "#000000",
  orange: "#E69F00",
  skyBlue: "#56B4E9",
  bluishGreen: "#009E73",
  yellow: "#F0E442",
  blue: "#0072B2",
  vermillion: "#D55E00",
  reddishPurple: "#CC79A7",
} as const;

export type OkabeItoColor = keyof typeof okabeIto;
