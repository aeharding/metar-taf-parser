import {
  CloudQuantity,
  CloudType,
  Descriptive,
  ValueIndicator,
  Phenomenon,
  TimeIndicator,
  WeatherChangeType,
  DistanceUnit,
  RunwayInfoTrend,
  RunwayInfoUnit,
  Intensity,
  SpeedUnit,
} from "model/enum";
import { Remark } from "command/remark";

export interface IWind {
  speed: number;
  direction: string;

  /**
   * If undefined, direction is variable
   */
  degrees?: number;

  gust?: number;
  minVariation?: number;
  maxVariation?: number;
  unit: SpeedUnit;
}

export interface IWindShear extends IWind {
  height: number;
}

export interface Distance {
  indicator?: ValueIndicator;
  value: number;
  unit: DistanceUnit;

  /** No Directional Visibility */
  ndv?: true;
}

export type Visibility = Distance & {
  /**
   * Never in North American METARs
   */
  min?: {
    /** Always in meters */
    value: number;
    direction: string;
  };
};

export interface IWeatherCondition {
  intensity?: Intensity;
  descriptive?: Descriptive;
  phenomenons: Phenomenon[];
}

export function isWeatherConditionValid(weather: IWeatherCondition): boolean {
  return (
    weather.phenomenons.length !== 0 ||
    weather.descriptive == Descriptive.THUNDERSTORM ||
    (weather.intensity === Intensity.IN_VICINITY &&
      weather.descriptive == Descriptive.SHOWERS)
  );
}

export interface ITemperature {
  temperature: number;
  day: number;
  hour: number;
}

export interface ITemperatureDated extends ITemperature {
  date: Date;
}

export interface IRunwayInfo {
  name: string;
  minRange: number;
  maxRange?: number;

  /**
   * Only used in North American runway ranges (feet unit of measurement)
   */
  indicator?: ValueIndicator;

  /**
   * Only used in IACO runway ranges (meters unit of measurement)
   */
  trend?: RunwayInfoTrend;

  unit: RunwayInfoUnit;
}

export interface ICloud {
  height?: number;
  quantity: CloudQuantity;
  type?: CloudType;
}

export interface IFlags {
  /**
   * Amended TAF
   */
  amendment?: true;

  /**
   * Amended METAR
   */
  auto?: true;

  /**
   * Canceled TAF
   */
  canceled?: true;

  /**
   * Corrected METAR/TAF
   */
  corrected?: true;

  /**
   * No data
   */
  nil?: true;
}

export interface IAbstractWeatherContainer extends IFlags {
  wind?: IWind;
  visibility?: Visibility;
  verticalVisibility?: number;
  windShear?: IWindShear;
  cavok?: true;
  remark?: string;
  remarks: Remark[];
  clouds: ICloud[];
  weatherConditions: IWeatherCondition[];
}

export interface IAbstractValidity {
  startDay: number;
  startHour: number;
}

/**
 * Exclusive for the TS port (because python has `time()` and js does not)
 */
export interface ITime {
  hour?: number;
  minute?: number;
}

export interface IAbstractWeatherCode extends IAbstractWeatherContainer, ITime {
  day?: number;
  message: string;
  station: string;
  trends: IAbstractTrend[];
}

export interface IAbstractWeatherCodeDated extends IAbstractWeatherCode {
  issued: Date;
}

export interface IMetar extends IAbstractWeatherCode {
  temperature?: number;
  dewPoint?: number;
  altimeter?: number;
  nosig?: true;
  runwaysInfo: IRunwayInfo[];

  /**
   * Not used in North America
   */
  trends: IMetarTrend[];
}

export interface ITAF extends IAbstractWeatherCode {
  validity: IValidity;
  maxTemperature?: ITemperature;
  minTemperature?: ITemperature;
  trends: TAFTrend[];

  /**
   * Just the first part of the TAF message without trends (FM, BECMG, etc)
   */
  initialRaw: string;
}

export interface IAbstractTrend extends IAbstractWeatherContainer {
  type: WeatherChangeType;
  raw: string;
}

export interface IMetarTrendTime extends ITime {
  type: TimeIndicator;
}

export interface IMetarTrend extends IAbstractTrend {
  times: IMetarTrendTime[];
}

export interface IBaseTAFTrend extends IAbstractTrend {
  /**
   * Will not be found on FM trends. May exist on others.
   *
   * If does not exist, probability is > 40%
   */
  probability?: number;

  /**
   * All trends have `startDay` and `startHour` defined. Additionally:
   *
   * - FM trends also have `startMinutes`. They **DO NOT** have an explicit end
   *   validity (it is implied by the following FM).
   * - All others (PROB, TEMPO, BECMG, INTER) have `endDay` and `endHour`.
   *
   * All properties are allowed to be accessed (as optionals), but if you want
   * type guarantees, you can check the trend type. For example:
   *
   * ```ts
   * switch (trend.type) {
   *   case WeatherChangeType.FM:
   *     // trend.validity now has startMinutes defined
   *     break;
   *   case WeatherChangeType.PROB:
   *   case WeatherChangeType.BECMG:
   *   case WeatherChangeType.TEMPO:
   *   case WeatherChangeType.INTER:
   *     // trend.validity now has endHour, endDay defined
   * }
   * ```
   */
  validity: IAbstractValidity & Partial<IFMValidity> & Partial<IValidity>;
}

export type TAFTrend = IBaseTAFTrend &
  (
    | {
        type: WeatherChangeType.FM;
        validity: IFMValidity;
      }
    | {
        type: WeatherChangeType;
        validity: IValidity;
      }
  );

export interface IEndValidity {
  endHour: number;
  endDay: number;
}

export interface IValidity extends IAbstractValidity, IEndValidity {}
export interface IValidityDated extends IAbstractValidity, IEndValidity {
  start: Date;
  end: Date;
}

export interface IFMValidity extends IAbstractValidity {
  startMinutes: number;
}
