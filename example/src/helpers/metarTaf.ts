import {
  Descriptive,
  Intensity,
  Phenomenon,
  SpeedUnit,
  CloudQuantity,
  CloudType,
  DistanceUnit,
  ValueIndicator,
  Visibility,
  ICloud,
} from "metar-taf-parser";

export enum FlightCategory {
  VFR = "VFR",
  MVFR = "MVFR",
  IFR = "IFR",
  LIFR = "LIFR",
}

export function formatIndicator(indicator: ValueIndicator | undefined) {
  switch (indicator) {
    case ValueIndicator.GreaterThan:
      return "or greater";
    case ValueIndicator.LessThan:
      return "or less";
    default:
      return "";
  }
}

export function formatPhenomenon(phenomenon: Phenomenon): string {
  switch (phenomenon) {
    case Phenomenon.RAIN:
      return "Rain";
    case Phenomenon.DRIZZLE:
      return "Drizzle";
    case Phenomenon.SNOW:
      return "Snow";
    case Phenomenon.SNOW_GRAINS:
      return "Snow grains";
    case Phenomenon.ICE_PELLETS:
      return "Ice pellets";
    case Phenomenon.ICE_CRYSTALS:
      return "Ice crystals";
    case Phenomenon.HAIL:
      return "Hail";
    case Phenomenon.SMALL_HAIL:
      return "Small hail";
    case Phenomenon.UNKNOW_PRECIPITATION:
      return "Unknown precipitation";
    case Phenomenon.FOG:
      return "Fog";
    case Phenomenon.VOLCANIC_ASH:
      return "Volcanic ash";
    case Phenomenon.MIST:
      return "Mist";
    case Phenomenon.HAZE:
      return "Haze";
    case Phenomenon.WIDESPREAD_DUST:
      return "Widespread dust";
    case Phenomenon.SMOKE:
      return "Smoke";
    case Phenomenon.SAND:
      return "Sand";
    case Phenomenon.SPRAY:
      return "Spray";
    case Phenomenon.SQUALL:
      return "Squall";
    case Phenomenon.SAND_WHIRLS:
      return "Sand whirls";
    case Phenomenon.THUNDERSTORM:
      return "Thunderstorm";
    case Phenomenon.DUSTSTORM:
      return "Duststorm";
    case Phenomenon.SANDSTORM:
      return "Sandstorm";
    case Phenomenon.FUNNEL_CLOUD:
      return "Funnel cloud";
    case Phenomenon.NO_SIGNIFICANT_WEATHER:
      return "No significant weather";
  }
}

export function formatDescriptive(
  descriptive: Descriptive | undefined,
  hasPhenomenon: boolean
): string {
  switch (descriptive) {
    case Descriptive.SHOWERS:
      return `Showers${hasPhenomenon ? " of" : ""}`;
    case Descriptive.SHALLOW:
      return "Shallow";
    case Descriptive.PATCHES:
      return `Patches${hasPhenomenon ? " of" : ""}`;
    case Descriptive.PARTIAL:
      return "Partial";
    case Descriptive.DRIFTING:
      return "Drifting";
    case Descriptive.THUNDERSTORM:
      return "Thunderstorm";
    case Descriptive.BLOWING:
      return "Blowing";
    case Descriptive.FREEZING:
      return "Freezing";
    default:
      return "";
  }
}

export function formatIntensity(intensity: Intensity | undefined): string {
  switch (intensity) {
    case Intensity.HEAVY:
      return "Heavy";
    case Intensity.IN_VICINITY:
      return "in vicinity";
    case Intensity.LIGHT:
      return "Light";
    default:
      return "";
  }
}

export function formatWind(speed: number, unit: SpeedUnit): string {
  return `${speed} ${unit}`;
}

export function formatVisibility(visibility: Visibility | undefined): string {
  if (!visibility) return "Unknown visibility";

  let value = `${visibility.value} ${visibility.unit}`;

  const indiciator = formatIndicator(visibility.indicator);

  if (indiciator) value = `${value} ${indiciator}`;

  return value;
}

export function formatCeiling(clouds: ICloud[]): string {
  const ceiling = determineCeilingOrLowestLayerFromClouds(clouds);

  let ret = "";

  if (!ceiling) return "No clouds found";

  ret += formatCloud(ceiling);

  return ret;
}

export function formatVerticalVisbility(
  verticalVisibility: number | undefined
): string | undefined {
  if (verticalVisibility == null) return;

  return `${verticalVisibility.toLocaleString()} ft AGL vertical visibility`;
}

export function formatCloud(cloud: ICloud): string {
  let ret = "";

  switch (cloud.quantity) {
    case CloudQuantity.NSC:
      return "No significant clouds";
    case CloudQuantity.SKC:
      return "Clear sky";
    case CloudQuantity.BKN:
      ret += "Broken clouds";
      break;
    case CloudQuantity.FEW:
      ret += "Few clouds";
      break;
    case CloudQuantity.SCT:
      ret += "Scattered clouds";
      break;
    case CloudQuantity.OVC:
      ret += "Overcast";
  }

  if (cloud.type) {
    ret += ` (${formatCloudType(cloud.type)})`;
  }

  ret += ` at ${cloud.height?.toLocaleString()}ft`;

  return ret;
}

function formatCloudType(type: CloudType): string {
  switch (type) {
    case CloudType.CB:
      return "Cumulonimbus";
    case CloudType.TCU:
      return "Towering cumulus";
    case CloudType.CI:
      return "Cirrus";
    case CloudType.CC:
      return "Cirrocumulus";
    case CloudType.CS:
      return "Cirrostratus";
    case CloudType.AC:
      return "Altocumulus";
    case CloudType.ST:
      return "Stratus";
    case CloudType.CU:
      return "Cumulus";
    case CloudType.AS:
      return "Astrostratus";
    case CloudType.NS:
      return "Nimbostratus";
    case CloudType.SC:
      return "Stratocumulus";
  }
}
export function getFlightCategory(
  visibility: Visibility | undefined,
  clouds: ICloud[],
  verticalVisibility?: number
): FlightCategory {
  const convertedVisibility = convertToMiles(visibility);
  const distance = convertedVisibility != null ? convertedVisibility : Infinity;
  const height =
    determineCeilingFromClouds(clouds)?.height ??
    verticalVisibility ??
    Infinity;

  let flightCategory = FlightCategory.VFR;

  if (height <= 3000 || distance <= 5) flightCategory = FlightCategory.MVFR;
  if (height <= 1000 || distance <= 3) flightCategory = FlightCategory.IFR;
  if (height <= 500 || distance <= 1) flightCategory = FlightCategory.LIFR;

  return flightCategory;
}

/**
 * Finds the ceiling. If no ceiling exists, returns the lowest cloud layer.
 */
export function determineCeilingFromClouds(
  clouds: ICloud[]
): ICloud | undefined {
  let ceiling: ICloud | undefined;

  clouds.forEach((cloud) => {
    if (
      cloud.height != null &&
      cloud.height < (ceiling?.height || Infinity) &&
      (cloud.quantity === CloudQuantity.OVC ||
        cloud.quantity === CloudQuantity.BKN)
    )
      ceiling = cloud;
  });

  return ceiling;
}

/**
 * Finds the ceiling. If no ceiling exists, returns the lowest cloud layer.
 */
function determineCeilingOrLowestLayerFromClouds(
  clouds: ICloud[]
): ICloud | undefined {
  let ceiling: ICloud | undefined;

  clouds.forEach((cloud) => {
    if (
      !ceiling ||
      (cloud.height != null &&
        (cloud.quantity === CloudQuantity.OVC ||
          cloud.quantity === CloudQuantity.BKN))
    ) {
      if (
        !ceiling ||
        ceiling.height == null ||
        cloud.height == null ||
        ceiling.height > cloud.height
      )
        ceiling = cloud;
    }
  });

  return ceiling;
}

function convertToMiles(visibility?: Visibility): number | undefined {
  if (!visibility) return;

  switch (visibility.unit) {
    case DistanceUnit.StatuteMiles:
      return visibility.value;
    case DistanceUnit.Meters:
      const distance = visibility.value * 0.000621371;

      if (visibility.value % 1000 === 0 || visibility.value === 9999)
        return Math.round(distance);

      return +distance.toFixed(2);
  }
}

export function getFlightCategoryCssColor(category: FlightCategory): string {
  switch (category) {
    case FlightCategory.LIFR:
      return `rgb(255, 0, 255)`;
    case FlightCategory.IFR:
      return `rgb(255, 0, 0)`;
    case FlightCategory.MVFR:
      return `rgb(0, 150, 255)`;
    case FlightCategory.VFR:
      return `rgb(0, 255, 0)`;
  }
}
