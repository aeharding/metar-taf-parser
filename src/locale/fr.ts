export default {
  CloudQuantity: {
    BKN: "nuages fragmentés",
    FEW: "peu",
    NSC: "pas de nuages significatifs.",
    OVC: "ciel couvert",
    SCT: "nuages épars",
    SKC: "pas de nuage",
  },
  CloudType: {
    CB: "Cumunolinbus",
    CC: "Cirrocumulus",
    TCU: "Cumulus bourgeonnant",
  },
  DepositBrakingCapacity: {
    NOT_REPORTED: "non reportée",
    POOR: "mauvaise",
    MEDIUM_POOR: "mauvaise/moyenne",
    MEDIUM: "moyenne",
    MEDIUM_GOOD: "moyenne/bonne",
    GOOD: "bonne",
    UNRELIABLE: "valeurs non fiables",
  },
  DepositCoverage: {
    NOT_REPORTED: "non reportée",
    LESS_10: "moins de 10%",
    FROM_11_TO_25: "de 11% à 25%",
    FROM_26_TO_50: "de 26% à 50%",
    FROM_51_TO_100: "de 51% à 100%",
  },
  DepositThickness: {
    NOT_REPORTED: "non reportée",
    LESS_1_MM: "moins de 1 mm",
    THICKNESS_40: "40 cm ou plus",
    CLOSED: "fermée",
  },
  DepositType: {
    NOT_REPORTED: "non reportée",
    CLEAR_DRY: "clair et sec",
    DAMP: "humide",
    WET_WATER_PATCHES: "humide ou flaques d'eau",
    RIME_FROST_COVERED: "couverte de givre ou de glace",
    DRY_SNOW: "neige sèche",
    WET_SNOW: "neige mouillée",
    ICE: "glace",
    COMPACTED_SNOW: "neige compactée ou roulée",
    FROZEN_RIDGES: "ornières ou crêtes gelées",
    SLUSH: "boue",
  },
  Descriptive: {
    BC: "bancs",
    BL: "chasse-poussière haute",
    DR: "chasse-poussière basse",
    FZ: "se congelant",
    MI: "mince",
    PR: "partiel",
    SH: "averses de",
    TS: "orage",
  },
  Error: {
    prefix: "Une erreur est survenue. Code erreur n°",
  },
  ErrorCode: {
    AirportNotFound: "L'aéroport n'a pas été trouvé pour ce message.",
    InvalidMessage: "Le message entré est invalide.",
  },
  Indicator: {
    M: "moins que",
    P: "plus que",
  },
  Intensity: {
    "-": "Faible",
    VC: "Au voisinage de",
  },
  "intensity-plus": "Fort",
  Phenomenon: {
    BR: "brume",
    DS: "tempête de poussière",
    DU: "poussières généralisées",
    DZ: "bruine",
    FC: "nuage en entonnoir",
    FG: "brouillard",
    FU: "fumée",
    GR: "grêle",
    GS: "grsil",
    HZ: "brume sèche",
    IC: "cristaux de glace",
    PL: "granules de glace",
    PO: "tourbillon de poussières sable",
    RA: "pluie",
    SA: "sable",
    SG: "neige en grains",
    SN: "neige",
    SQ: "grains",
    SS: "tempête de sable",
    UP: "précipitation inconnue",
    VA: "cendres volcaniques",
    TS: "orage",
  },
  Remark: {
    AO1: "stations automatisées sans discriminateur de précipitation",
    AO2: "stations automatisées avec discriminateur de précipitation",
    ALQDS: "tous les quadrants",
    Barometer: [
      "Augmentation, puis diminution",
      "Augmentation, puis stabilisation or augmentation puis augmentation légère",
      "augmentation régulière ou instable",
      "Diminution ou stabilisation puis diminution; ou augmentation puis augmentation rapide",
      "Stable",
      "Diminution, puis augmentation",
      "Diminution puis stabilisation; ou diminution puis diminution plus lente",
      "diminution stable ou instable",
      "stable ou augmentation puis diminution; ou diminution puis diminution plus rapide",
    ],
    BASED: "basée",
    Ceiling: {
      Height: "variation du plafond entre {0} et {1} pieds",
      Second: {
        Location:
          "plafond de {0} pieds mesuré par un second capteur situé à {1}",
      },
    },
    DSNT: "éloigné",
    FCST: "prévision",
    FUNNELCLOUD: "nuage en entonnoir",
    Hail: {
      "0": "les plus gros grêlons ont un diamètre de {0} pouces",
      LesserThan:
        "les plus gros grêlons ont un diamètre plus petit que {0} pouces",
    },
    Hourly: {
      Maximum: {
        Temperature: "température maximale sur 6 heures de {0}°C",
        Minimum: {
          Temperature:
            "Température maximale sur 24 heures de {0}°C et température minimale sur 24 heures de {1}°C",
        },
      },
      Minimum: {
        Temperature: "Température minimale sur 6 heures de {0}°C",
      },
      Temperature: {
        "0": "température horaire de {0}°C",
        Dew: {
          Point: "température horaire de {0}°C et point de rosée de {1}°C",
        },
      },
    },
    Ice: {
      Accretion: {
        Amount:
          "{0}/100 d''un pouce d''accrétion de glace au cours des {1} dernières heures",
      },
    },
    HVY: "fort",
    LGT: "léger",
    LTG: "éclair",
    MOD: "modéré",
    Obscuration: "couche de {0} à {1} pieds composée de {2}",
    ON: "sur",
    NXT: "prochain",
    PeakWind:
      "vent de pointe de {1} noeuds en provenance de {0} degrés à {2}:{3}",
    Precipitation: {
      Amount: {
        Hourly:
          "{0}/100 d''un pouce de précipitation est tombé au cours de la dernière heure",
        "3": {
          "6": "{1} pouces de précipitations tombées au cours des {0} dernières heures",
        },
        "24": "{0} pouces de précipitations tombées au cours des 24 dernières heures",
      },
      Beg: {
        "0": "{0} {1} commençant à {2}:{3}",
        End: "{0} {1} commencant à {2}:{3} finissant à {4}:{5}",
      },
      End: "{0} {1} se terminant à {2}:{3}",
    },
    Pressure: {
      Tendency: "de {0} hectopascals au cours des 3 dernières heures",
    },
    PRESFR: "diminution rapide de la pression",
    PRESRR: "augmentation rapide de la pression",
    Second: {
      Location: {
        Visibility: "visibilité de {0} SM mesuré par un capteur situé à {1}",
      },
    },
    Sea: {
      Level: {
        Pressure: "pression au niveau de la mer de {0} HPa",
      },
    },
    Sector: {
      Visibility: "visibilité de {1} SM dans la direction {0}",
    },
    SLPNO: "pression au niveau de la mer non disponible",
    Snow: {
      Depth: "profondeur de neige de {0} pouces",
      Increasing: {
        Rapidly:
          "épaisseur de neige de {0} pouces sur la dernière heure avec une épaisseur totale au sol de {1} pouces",
      },
      Pellets: "{0} grésil",
    },
    Sunshine: {
      Duration: "{0} minutes d''ensoleillement",
    },
    Surface: {
      Visibility: "visibility de surface de {0} miles",
    },
    Thunderstorm: {
      Location: {
        "0": "orage se situant {0} de la station",
        Moving: "orage se situant {0} de la station se déplacant vers {1}",
      },
    },
    Tornadic: {
      Activity: {
        Beginning: "{0} commencant à {1}:{2} {3} SM {4} de la station",
        BegEnd:
          "{0} commencant à {1}:{2} finissant à {3}:{4} {5} SM {6} de la station",
        Ending: "{0} finissant à {1}:{2} {3} SM {4} de la station",
      },
    },
    TORNADO: "tornade",
    Tower: {
      Visibility: "visibility de la tour de contrôle de {0} miles",
    },
    Variable: {
      Prevailing: {
        Visibility: "variation de la visibilité dominante entre {0} et {1} SM",
      },
      Sky: {
        Condition: {
          "0": "couche de nuages variant entre {0} et {1}",
          Height: "couche de nuages à {0} pieds variant entre {1} et {2}",
        },
      },
    },
    Virga: {
      Direction: "virga au {0} de la station",
    },
    WATERSPOUT: "trombe",
    Water: {
      Equivalent: {
        Snow: {
          Ground: "équivalent d''eau de {0} pouces de neige",
        },
      },
    },
    WindShift: {
      "0": "changement de vent à {0}:{1}",
      FROPA: "changement de vent accompagné d''un passage de front à {0}:{1}",
    },
  },
  MetarFacade: {
    InvalidIcao: "Code ICAO invalide.",
  },
  Converter: {
    D: "decroissant",
    E: "Est",
    ENE: "Est Nord Est",
    ESE: "Est Sud Est",
    N: "Nord",
    NE: "Nord Est",
    NNE: "Nord Nord Est",
    NNW: "Nord Nord Ouest",
    NSC: "Aucun changement significatif",
    NW: "Nord Ouest",
    S: "Est",
    SE: "Sud Est",
    SSE: "Sud Sud Est",
    SSW: "Sud Sud Ouest",
    SW: "Sud Ouest",
    U: "accroissement",
    W: "Ouest",
    WNW: "Ouest Nord Ouest",
    WSW: "Ouest Sud Ouest",
  },
  WeatherChangeType: {
    FM: "De",
    BECMG: "Devenant",
    TEMPO: "Temporairement",
    PROB: "Probabilité",
  },
  TimeIndicator: {
    AT: "à",
    FM: "De",
    TL: "jusqu'à",
  },
  ToString: {
    airport: "aéroport",
    altimeter: "altimètre (hPa)",
    amendment: "amendement",
    clouds: "nuages",
    day: {
      month: "jour du mois",
      hour: "heure du jour",
    },
    deposit: {
      braking: "capacité de freinage",
      coverage: "couverture",
      thickness: "épaisseur",
      type: "type dépôt",
    },
    descriptive: "descriptif",
    dew: {
      point: "point de rosée",
    },
    end: {
      day: {
        month: "jour de fin du mois",
      },
      hour: {
        day: "heure de fin du jour",
      },
    },
    height: {
      feet: "altitude (pieds)",
      meter: "altitude (m)",
    },
    intensity: "intensité",
    indicator: "indicateur",
    message: "message original",
    name: "nom",
    phenomenons: "phénomènes",
    probability: "probabilité",
    quantity: "quantité",
    remark: "remarques",
    report: {
      time: "heure du rapport",
    },
    runway: {
      info: "informations sur la piste",
    },
    start: {
      day: {
        month: "jour de début du mois",
      },
      hour: {
        day: "heure de début du jour",
      },
      minute: "minute de début",
    },
    temperature: {
      "0": "température (°C)",
      max: "température maximale (°C)",
      min: "température minimale (°C)",
    },
    trend: "tendance",
    trends: "tendances",
    visibility: {
      main: "visibilité principale",
      min: {
        "0": "visibilité minimale",
        direction: "direction de la visibilité minimale",
      },
      max: "visibilité maximale",
    },
    vertical: {
      visibility: "visibilité verticale (pieds)",
    },
    weather: {
      conditions: "conditions météorologique",
    },
    wind: {
      direction: {
        degrees: "direction (degrés)",
      },
      gusts: "rafales",
      min: {
        variation: "variation minimale du vent",
      },
      max: {
        variation: "variation maximale du vent",
      },
      speed: "vitesse",
      unit: "unité",
    },
  },
};
