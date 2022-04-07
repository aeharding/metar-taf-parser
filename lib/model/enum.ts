export enum CloudQuantity {
  /**
   * Sky clear
   */
  SKC = "SKC",
  /**
   * Few
   */
  FEW = "FEW",
  /**
   * Broken
   */
  BKN = "BKN",
  /**
   * Scattered
   */
  SCT = "SCT",
  /**
   * Overcast
   */
  OVC = "OVC",
  /**
   * No significant cloud
   */
  NSC = "NSC",
}

export enum CloudType {
  /**
   * Cumulonimbus
   */
  CB = "CB",
  /**
   * Towering cumulus, cumulus congestus
   */
  TCU = "TCU",
  /**
   * Cirrus
   */
  CI = "CI",
  /**
   * Cirrocumulus
   */
  CC = "CC",
  /**
   * Cirrostratus
   */
  CS = "CS",
  /**
   * Altocumulus
   */
  AC = "AC",
  /**
   * Stratus
   */
  ST = "ST",
  /**
   * Cumulus
   */
  CU = "CU",
  /**
   * Astrostratus
   */
  AS = "AS",
  /**
   * Nimbostratus
   */
  NS = "NS",
  /**
   * Stratocumulus
   */
  SC = "SC",
}

export enum Intensity {
  LIGHT = "-",
  HEAVY = "+",
  IN_VICINITY = "VC",
}

export enum Descriptive {
  SHOWERS = "SH",
  SHALLOW = "MI",
  PATCHES = "BC",
  PARTIAL = "PR",
  DRIFTING = "DR",
  THUNDERSTORM = "TS",
  BLOWING = "BL",
  FREEZING = "FZ",
}

export enum Phenomenon {
  RAIN = "RA",
  DRIZZLE = "DZ",
  SNOW = "SN",
  SNOW_GRAINS = "SG",
  ICE_PELLETS = "PL",
  ICE_CRYSTALS = "IC",
  HAIL = "GR",
  SMALL_HAIL = "GS",
  UNKNOW_PRECIPITATION = "UP",
  FOG = "FG",
  VOLCANIC_ASH = "VA",
  MIST = "BR",
  HAZE = "HZ",
  WIDESPREAD_DUST = "DU",
  SMOKE = "FU",
  SAND = "SA",
  SPRAY = "PY",
  SQUALL = "SQ",
  SAND_WHIRLS = "PO",
  DUSTSTORM = "DS",
  SANDSTORM = "SS",
  FUNNEL_CLOUD = "FC",
}

export enum TimeIndicator {
  AT = "AT",
  FM = "FM",
  TL = "TL",
}

export enum WeatherChangeType {
  FM = "FM",
  BECMG = "BECMG",
  TEMPO = "TEMPO",
  PROB = "PROB",
}
