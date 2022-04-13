import {
  CloudQuantity,
  CloudType,
  Descriptive,
  Phenomenon,
  TimeIndicator,
  WeatherChangeType,
} from "model/enum";
import { Remark } from "src/command/remark";

export interface ICountry {
  name: string;
}

export interface IAirport {
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  latitude: string;
  longitude: string;
  altitude: string;
  timezone: string;
  dst: boolean;
  tzDatabase: unknown;
}

export interface IWind {
  speed: number;
  direction: string;
  degrees?: number;
  gust?: number;
  minVariation?: number;
  maxVariation?: number;
  unit: string;
}

export interface IWindShear extends IWind {
  height: number;
}

export interface Visibility {
  distance: string;
  minDistance?: number;
  minDirection?: string;
}

export interface IWeatherCondition {
  intensity?: string;
  descriptive?: Descriptive;
  phenomenons: Phenomenon[];
}

export function isWeatherConditionValid(weather: IWeatherCondition): boolean {
  return (
    weather.phenomenons.length !== 0 ||
    weather.descriptive == Descriptive.THUNDERSTORM
  );
}

export interface ITemperatureDated {
  temperature: number;
  day: number;
  hour: number;
}

export interface IRunwayInfo {
  name: string;
  minRange: number;
  maxRange?: number;
  trend: string;
}

export interface ICloud {
  height?: number;
  quantity: CloudQuantity;
  type?: CloudType;
}

export interface IAbstractWeatherContainer {
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
  hour: number;
  minute: number;
}

export interface IAbstractWeatherCode extends IAbstractWeatherContainer, ITime {
  day: number;
  airport?: IAirport;
  message: string;
  station: string;
  trends: IAbstractTrend[];
}

export interface IMetar extends IAbstractWeatherCode {
  temperature?: number;
  dewPoint?: number;
  altimeter?: number;
  nosig?: true;
  auto?: true;
  runwaysInfo: IRunwayInfo[];
  trends: IMetarTrend[];
}

export interface ITAF extends IAbstractWeatherCode {
  validity: IValidity;
  maxTemperature?: ITemperatureDated;
  minTemperature?: ITemperatureDated;
  amendment?: true;
  trends: ITAFTrend[];
}

export interface IAbstractTrend extends IAbstractWeatherContainer {
  type: WeatherChangeType;
}

export interface IMetarTrendTime extends ITime {
  type: TimeIndicator;
}

export interface IMetarTrend extends IAbstractTrend {
  times: IMetarTrendTime[];
}

export interface ITAFTrend extends IAbstractTrend {
  probability?: number;
  validity?: IFMValidity;
}

export interface IEndValidity {
  endHour: number;
  endDay: number;
}

export interface IValidity extends IAbstractValidity, IEndValidity {}

export interface IFMValidity extends IAbstractValidity, Partial<IEndValidity> {
  startMinutes?: number;
}
