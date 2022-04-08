import {
  CloudQuantity,
  CloudType,
  Descriptive,
  Phenomenon,
  TimeIndicator,
  WeatherChangeType,
} from "./enum";

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
  speed: string;
  direction: string;
  degrees: number;
  gust: number;
  minVariation: number;
  maxVariation: number;
  unit: string;
}

export interface IWindShear extends IWind {
  height: number;
}

export interface Visibility {
  distance: number;
  minDistance: number;
  minDirection: string;
}

export interface IWeatherCondition {
  intensity: string;
  descriptive: Descriptive;
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
  maxRange: number;
  trend: unknown;
}

export interface ICloud {
  height: number;
  quantity: CloudQuantity;
  type: CloudType;
}

export interface IAbstractWeatherContainer {
  wind: IWind;
  visibility: Visibility;
  verticalVisibility: number;
  windShear: IWindShear;
  cavok: boolean;
  remark: string;
  remarks: string[];
  clouds: ICloud[];
  weatherConditions: IWeatherCondition[];
}

export interface IAbstractValidity {
  startDay: number;
  startHour: number;
}

export interface IAbstractWeatherCode extends IAbstractWeatherContainer {
  day: number;
  time: string;
  airport: IAirport;
  message: string;
  station: string;
  trends: unknown[];
}

export interface IMetar extends IAbstractWeatherCode {
  temperature: number;
  dewPoint: number;
  altimeter: number;
  nosig: boolean;
  auto: boolean;
  runwaysInfo: IRunwayInfo[];
}

export interface ITAF extends IAbstractWeatherCode {
  validity: IAbstractValidity;
  maxTemperature: number;
  minTemperature: number;
  amendment: boolean;
}

export interface IAbstractTrend extends IAbstractWeatherContainer {
  type: WeatherChangeType;
}

export interface IMetarTrendTime {
  type: TimeIndicator;
  time: string;
}

export interface MetarTrend extends IAbstractTrend {
  times: IMetarTrendTime[];
}

export interface ITAFTrend extends IAbstractTrend {
  probability: number;
  validity: IAbstractValidity;
}

export interface IValidity extends IAbstractValidity {
  endHour: number;
  endDay: number;
}

export interface IFMValidity extends IAbstractValidity {
  startMinutes: number;
}
