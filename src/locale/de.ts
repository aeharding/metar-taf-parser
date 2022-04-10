export default {
  CloudQuantity: {
    BKN: "stark bewölkt",
    FEW: "leicht bewölkt",
    NSC: "keine signifikanten Wolken",
    OVC: "bedeckt",
    SCT: "aufgelockert",
    SKC: "wolkenlos",
  },
  CloudType: {
    CC: "Cirrocumulus",
    TCU: "turmartigen Cumulus",
  },
  DepositBrakingCapacity: {
    NOT_REPORTED: "nicht gemeldet",
    POOR: "schlecht",
    MEDIUM_POOR: "schlecht/mäßig",
    MEDIUM: "mäßig",
    MEDIUM_GOOD: "mäßig/gut",
    GOOD: "gut",
    UNRELIABLE: "Werte unzuverlässig",
  },
  DepositCoverage: {
    NOT_REPORTED: "nicht gemeldet",
    LESS_10: "weniger als 10%",
    FROM_11_TO_25: "von 11% bis 25%",
    FROM_26_TO_50: "von 26% bis 50%",
    FROM_51_TO_100: "von 51% bis 100%",
  },
  DepositThickness: {
    NOT_REPORTED: "nicht gemeldet",
    LESS_1_MM: "weniger als 1 mm",
    THICKNESS_40: "40 cm oder mehr",
    CLOSED: "geschlossen",
  },
  DepositType: {
    NOT_REPORTED: "nicht gemeldet",
    CLEAR_DRY: "frei von Ablagerungen und trocken",
    DAMP: "feucht",
    WET_WATER_PATCHES: "nass oder Wasserpfützen",
    RIME_FROST_COVERED: "reif- oder frostbedeckt",
    DRY_SNOW: "trockener Schnee",
    WET_SNOW: "nasser Schnee",
    ICE: "Eis",
    COMPACTED_SNOW: "kompakter Schnee",
    FROZEN_RIDGES: "festgefrorene Radspuren",
  },
  Descriptive: {
    BC: "Schwaden",
    BL: "treiben",
    DR: "fegen",
    FZ: "gefrierend",
    MI: "flach",
    PR: "teilweise",
    SH: "Schauer von",
    TS: "Gewitter",
  },
  Error: {
    prefix: "Ein Fehler ist aufgetretten. Error Code n°",
  },
  ErrorCode: {
    AirportNotFound: "Der Flughafen wurde in dieser Mitteilung nicht gefunden",
    InvalidMessage: "Eingegebende Mitteilung nicht gültig",
  },
  Indicator: {
    M: "weniger als",
    P: "mehr als",
  },
  Intensity: {
    "-": "leicht",
    VC: "in Flugplatznähe",
  },
  "intensity-plus": "stark",
  Phenomenon: {
    BR: "feuchter Dunst",
    DS: "Staubsturm",
    DU: "weit verbreiteter Staub",
    DZ: "Sprühregen",
    FC: "Wolkenschlauch",
    FG: "Nebel",
    FU: "Rauch",
    GR: "Hagel; Körner größer 5mm",
    GS: "Graupel; Körner kleiner 5mm",
    HZ: "trockener Dunst",
    IC: "Eiskristalle",
    PL: "Eiskörner",
    PO: "Staub/Sandwirbel",
    PY: "Sprühregen",
    RA: "Regen",
    SA: "Sand",
    SG: "Schneegriesel",
    SN: "Schnee",
    SQ: "Böen",
    SS: "Sandsturm",
    UP: "unbekannte Erscheinung",
    VA: "Vulkanasche",
    TS: "Gewittersturm",
  },
  Remark: {
    AO1: "automatisierte Station ohne Niederschlagsunterscheidung",
    AO2: "automatisierte Station mit Niederschlagsunterscheidung",
    BASED: "stationiert",
    Ceiling: {
      Height: "Wolkenhöhe zwischen {0} und {1} Fuss",
      Second: {
        Location:
          "Wolkenuntergrenze {0} Fuss gemessen von zweitem Sensor bei {1}",
      },
    },
    FCST: "Vorhersage",
    FUNNELCLOUD: "Trichterwolke",
    Hail: {
      "0": "größte Hagelkörner mit einem Durchmesser von {0} Zoll",
      LesserThan:
        "größte Hagelkörner mit einem Durchmesser von weniger als [0} Zoll",
    },
    HVY: "stark",
    LGT: "leicht",
    MOD: "mäßig",
    Obscuration: "{0} bei {1} Fuss bestehend aus {2}",
    ON: "auf",
    NXT: "nächster",
    PeakWind: "Windspitze von {1} Knoten aus {0} Grad um {2}:{3}",
    Precipitation: {
      Beg: {
        End: "{0} {1} begann um {2}:{3} endete um {4}:{5}",
      },
    },
    PRESFR: "schnell fallender Luftdruck",
    PRESRR: "schnell steigender Luftdruck",
    Second: {
      Location: {
        Visibility: "Sicht von {0} SM gemessen von zweitem Sensor bei {1}",
      },
    },
    Sea: {
      Level: {
        Pressure: "Luftdruck Meeresniveau bei {0} hPa",
      },
    },
    Sector: {
      Visibility: "Sicht von {1} SM nach {0}",
    },
    SLPNO: "Luftdruck Meeresniveau nicht verfügbar",
    Snow: {
      Increasing: {
        Rapidly:
          "Schneehöhe vergrößert um {0} Zoll in der letzten Stunde zu Schneehöhe von {1} Zoll",
      },
      Pellets: "{0} Graupel",
    },
    Surface: {
      Visibility: "Sicht von {0} SM am Boden",
    },
    Thunderstorm: {
      Location: {
        "0": "Gewitter im {0} der Station",
        Moving: "Gewitter im {0} der Station, zieht nach {1}",
      },
    },
    Tornadic: {
      Activity: {
        Beginning: "{0} begann um {1}:{2} {3} SM im {4} der Station",
        BegEnd:
          "{0} begann um {1}:{2} endete um {3}:{4} {5} SM im {6} der Station",
        Ending: "{0} endete um {1}:{2} {3} SM im {4} der Station",
      },
    },
    TORNADO: "Tornado",
    Tower: {
      Visibility: "Sicht von {0} SM am Turm",
    },
    Variable: {
      Prevailing: {
        Visibility: "vorherrschende Sicht veränderlich zwischen {0} und {1} SM",
      },
      Sky: {
        Condition: {
          "0": "Bewölkung veränderlich zwischen {0} und {1}",
          Height:
            "Wolkenschicht bei {0} Fuss veränderlich zwischen {1} und {2}",
        },
      },
    },
    VIRGA: "Virga",
    Virga: {
      Direction: "Virga im {0} der Station",
    },
    WATERSPOUT: "Wasserhose",
    WindShift: {
      "0": "Windveränderung um {0}:{1}",
      FROPA: "Windveränderung begleitet von Frontdurchzug um {0}:{1}",
    },
  },
  MetarFacade: {
    InvalidIcao: "Icao Code ist nicht gültig",
  },
  Converter: {
    D: "abnehmend",
    E: "Ost",
    ENE: "Ostnordost",
    ESE: "Ostsüdost",
    N: "Nord",
    NE: "Nordost",
    NNE: "Nordnordost",
    NNW: "Nordnordwest",
    NSC: "keine wesentliche Änderung",
    NW: "Nordwest",
    S: "Süd",
    SE: "Südost",
    SSE: "Südsüdost",
    SSW: "Südsüdwest",
    SW: "Südwest",
    U: "zunehmend",
    VRB: "veränderlich",
    WNW: "Westnordwest",
    WSW: "Westsüdwest",
  },
  WeatherChangeType: {
    FM: "Von",
    BECMG: "Übergehend",
    TEMPO: "Temporär",
    PROB: "Warscheinlichkeit",
  },
  TimeIndicator: {
    AT: "um",
    FM: "von",
    TL: "bis um",
  },
  ToString: {
    airport: "Flughafen",
    altimeter: "Höhenmesser",
    amendment: "Ergänzung",
    auto: "automatische Station",
    cavok: "Bewölkung und Sicht OK",
    clouds: "Wolken",
    day: {
      month: "Tag",
      hour: "Stunde",
    },
    deposit: {
      braking: "Bremswirkung",
      coverage: "Bedeckung",
      thickness: "Stärke",
      type: "Typ der Ablagerung",
    },
    descriptive: "Eigenschaft",
    dew: {
      point: "Taupunkttemperatur",
    },
    end: {
      day: {
        month: "Tag",
      },
      hour: {
        day: "Stunde",
      },
    },
    height: {
      feet: "Höhe (Fuss)",
      meter: "Höhe (m)",
    },
    intensity: "Intensität",
    indicator: "Indikator",
    message: "ursprüngliche Meldung",
    name: "Name",
    nosig: "keine wesentlichen Änderungen",
    phenomenons: "Erscheinungen",
    probability: "Wahrscheinlichkeit",
    quantity: "Menge",
    remark: "Bemerkungen",
    report: {
      time: "Zeit der Meldung",
    },
    runway: {
      info: "Pisteninformationen",
    },
    start: {
      day: {
        month: "Tag",
      },
      hour: {
        day: "Stunde",
      },
      minute: "Minute",
    },
    temperature: {
      "0": "Temperatur (°C)",
      max: "maximale Temperatur (°C)",
      min: "minimale Temperatur (°C)",
    },
    trend: "Trend",
    trends: "Trends",
    type: "Typ",
    visibility: {
      main: "Hauptsicht",
      min: {
        "0": "minimale Sicht",
        direction: "Richtung der minimalen Sicht",
      },
      max: "maximale Sicht",
    },
    vertical: {
      visibility: "vertikale Sicht (ft)",
    },
    weather: {
      conditions: "Wetterbedingungen",
    },
    wind: {
      direction: {
        "0": "Richtung",
        degrees: "Richtung (Grad)",
      },
      gusts: "Böen",
      min: {
        variation: "minimale Windänderung",
      },
      max: {
        variation: "maximale Windänderung",
      },
      speed: "Geschwindigkeit",
      unit: "Einheit",
    },
  },
};
