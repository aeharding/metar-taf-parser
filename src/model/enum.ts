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

/**
 * Moderate has no qualifier.
 */
export enum Intensity {
  LIGHT = "-",

  /**
   * Heavy or well-developed
   */
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
  THUNDERSTORM = "TS",
  DUSTSTORM = "DS",
  SANDSTORM = "SS",
  FUNNEL_CLOUD = "FC",
  NO_SIGNIFICANT_WEATHER = "NSW",
}

export enum TimeIndicator {
  AT = "AT",
  FM = "FM",
  TL = "TL",
}

/**
 * https://www.aviationweather.gov/taf/decoder
 */
export enum WeatherChangeType {
  /**
   * FROM Group
   *
   * ie. `FM1600`
   *
   * The FM group is used when a rapid change, usually occuring in less than one
   * hour, in prevailing conditions is expected. Typically, a rapid change of
   * prevailing conditions to more or less a completely new set of prevailing
   * conditions is associated with a synoptic feature passing through the
   * terminal area (cold or warm frontal passage). Appended to the FM indicator
   * is the four-digit hour and minute the change is expected to begin and
   * continues until the next change group or until the end of the current
   * forecast.
   *
   * A FM group will mark the beginning of a new line in a TAF report. Each FM
   * group contains all the required elements -- wind, visibility, weather, and
   * sky condition. Weather will be omitted in FM groups when it is not
   * significant to aviation. FM groups will not include the contraction NSW.
   *
   * Examples:
   *
   *  1. `FM0100 SKC` - After 0100Z sky clear
   *  2. `FM1430 OVC020` - After 1430Z ceiling two thousand overcast
   */
  FM = "FM",

  /**
   * BECOMING Group
   *
   * ie. `BECMG 2224`
   *
   * The BECMG group is used when a gradual change in conditions is expected
   * over a longer time period, usually two hours. The time period when the
   * change is expected is a four-digit group with the beginning hour and ending
   * hour of the change period which follows the BECMG indicator. The gradual
   * change will occur at an unspecified time within this time period. Only the
   * conditions are carried over from the previous time group.
   *
   * Example:
   *
   *  1. `OVC012 BECMG 1416 BKN020` - Ceiling one thousand two hundred overcast.
   *     Then a gradual change to ceiling two thousand broken between 1400Z and
   *     1600Z.
   */
  BECMG = "BECMG",

  /**
   * TEMPORARY Group
   *
   * ie. `TEMPO 1316`
   *
   * The TEMPO group is used for any conditions in wind, visibility, weather, or
   * sky condition which are expected to last for generally less than an hour at
   * a time (occasional), and are expected to occur during less than half the
   * time period. The TEMPO indicator is followed by a four-digit group giving
   * the beginning hour and ending hour of the time period during which the
   * temporary conditions are expected. Only the changing forecast
   * meteorological conditions are included in TEMPO groups. The omitted
   * conditions are carried over from the previous time group.
   *
   * Examples:
   *
   *  1. `SCT030 TEMPO 1923 BKN030` - Three thousand scattered with occasional
   *     ceilings three thousand broken between 1900Z and 2300Z.
   *  2. `4SM HZ TEMPO 0006 2SM BR HZ` - Visibility four in haze with occasional
   *     visibility two in mist and haze between 0000Z and 0600Z.
   */
  TEMPO = "TEMPO",

  /**
   * For periods up to 30 minutes (`INTER` or intermittent).
   *
   * Otherwise, similar to `TEMPO`
   */
  INTER = "INTER",

  /**
   * Probability Forecast
   *
   * ie. `PROB40 0006`
   *
   * The probability or chance of thunderstorms or other precipitation events
   * occuring, along with associated weather conditions (wind, visibility, and
   * sky conditions).
   *
   * The PROB40 group is used when the occurrence of thunderstorms or
   * precipitation is in the 30% to less than 50% range, thus the probability
   * value 40 is appended to the PROB contraction. This is followed by a
   * four-digit group giving the beginning hour and ending hour of the time
   * period during which the thunderstorms or precipitation is expected.
   *
   * Note: PROB40 will not be shown during the first six hours of a forecast.
   *
   * Examples:
   *
   *  1. `PROB40 2102 1/2SM +TSRA` - Chance between 2100Z and 0200Z of
   *     visibility one-half thunderstorm, heavy rain.
   *  2. `PROB40 1014 1SM RASN` - Chance between 1000Z and 1400Z of visibility
   *     one rain and snow.
   *  3. `PROB40 2024 2SM FZRA` - Chance between 2000Z and 0000Z of visibility
   *     two freezing rain.

   */
  PROB = "PROB",
}

export enum Direction {
  E = "E",
  ENE = "ENE",
  ESE = "ESE",
  N = "N",
  NE = "NE",
  NNE = "NNE",
  NNW = "NNW",
  NW = "NW",
  S = "S",
  SE = "SE",
  SSE = "SSE",
  SSW = "SSW",
  SW = "SW",
  W = "W",
  WNW = "WNW",
  WSW = "WSW",
}

export enum DistanceUnit {
  Meters = "m",
  StatuteMiles = "SM",
}

export enum SpeedUnit {
  Knot = "KT",
  MetersPerSecond = "MPS",
  KilometersPerHour = "KM/H",
}

/**
 * Used to indicate the actual value is greater than or less than the value written
 *
 * For example,
 *
 *  1. `P6SM` = visibility greater than 6 statute miles
 *  2. `M1/4SM` = visibility less than 1/4 statute mile
 */
export enum ValueIndicator {
  GreaterThan = "P",
  LessThan = "M",
}

export enum RunwayInfoTrend {
  Uprising = "U",
  Decreasing = "D",
  NoSignificantChange = "N",
}

export enum RunwayInfoUnit {
  Feet = "FT",
  Meters = "m",
}

export enum IcingIntensity {
  /**
   * Trace Icing or None.
   *
   * Air Force code 0 means a trace of icing.
   * World Meteorological Organization code 0 means no icing
   */
  None = "0",

  /** Light Mixed Icing. */
  Light = "1",

  /** Light Rime Icing In Cloud. */
  LightRimeIcingCloud = "2",

  /** Light Clear Icing In Precipitation. */
  LightClearIcingPrecipitation = "3",

  /** Moderate Mixed Icing. */
  ModerateMixedIcing = "4",

  /** Moderate Rime Icing In Cloud. */
  ModerateRimeIcingCloud = "5",

  /** Moderate Clear Icing In Precipitation. */
  ModerateClearIcingPrecipitation = "6",

  /** Severe Mixed Icing. */
  SevereMixedIcing = "7",

  /** Severe Rime Icing In Cloud. */
  SevereRimeIcingCloud = "8",

  /** Severe Clear Icing In Precipitation. */
  SevereClearIcingPrecipitation = "9",
}

export enum TurbulenceIntensity {
  /** None. */
  None = "0",

  /** Light turbulence. */
  Light = "1",

  /** Moderate turbulence in clear air, occasional. */
  ModerateClearAirOccasional = "2",

  /** Moderate turbulence in clear air, frequent. */
  ModerateClearAirFrequent = "3",

  /** Moderate turbulence in cloud, occasional. */
  ModerateCloudOccasional = "4",

  /** Moderate turbulence in cloud, frequent. */
  ModerateCloudFrequent = "5",

  /** Severe turbulence in clear air, occasional. */
  SevereClearAirOccasional = "6",

  /** Severe turbulence in clear air, frequent. */
  SevereClearAirFrequent = "7",

  /** Severe turbulence in cloud, occasional. */
  SevereCloudOccasional = "8",

  /** Severe turbulence in cloud, frequent. */
  SevereCloudFrequent = "9",

  /** Extreme turbulence */
  Extreme = "X",
}
