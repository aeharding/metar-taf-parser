export interface Country {
  name: string;
}

export interface Airport {
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

export interface Wind {
  speed: string;
  direction: string;
  degrees: number;
  gust: number;
  minVariation: number;
  maxVariation: number;
  unit: string;
}

export interface WindShear {
  height: number;
}

export interface Visibility {
  distance: number;
  minDistance: number;
  minDirection: string;
}

export interface WeatherCondition {
  intensity: string;
  descriptive: string;
  phenomenons: string[];
}
