export default {
  CloudQuantity: {
    BKN: "molto nuvoloso",
    FEW: "leggermente nuvoloso",
    NSC: "Nessuna nuvola significativa",
    OVC: "coperto",
    SCT: "sparse",
    SKC: "cielo sereno",
  },
  CloudType: {
    AC: "Altocumulo",
    AS: "Altostrato",
    CB: "Cumulonembo",
    CC: "Cirrocumulo",
    CI: "Cirro",
    CS: "Cirrostrato",
    CU: "Cumulo",
    NS: "Nembostrato",
    SC: "Stratocumulo",
    ST: "Strato",
    TCU: "Cumuli torreggiantidecreasing",
  },
  Converter: {
    D: "Diminuzione",
    E: "Est",
    ENE: "Est Nord Est",
    ESE: "Est Sud Est",
    N: "Nord",
    NE: "Nord Est",
    NNE: "Nord Nord Est",
    NNW: "Nord Nord Ovest",
    NSC: "nessun cambiamento significativo",
    NW: "Nord Ovest",
    S: "Sud",
    SE: "Sud Est",
    SSE: "Sud Sud Est",
    SSW: "Sud Sud Ovest",
    SW: "Sud Ovest",
    U: "sempre più",
    VRB: "Variabile",
    W: "Ovest",
    WNW: "Ovest Nord Ovest",
    WSW: "Ovest Sud Ovest",
  },
  DepositBrakingCapacity: {
    GOOD: "buono",
    MEDIUM: "medio",
    MEDIUM_GOOD: "medio/buono",
    MEDIUM_POOR: "medio/scarso",
    NOT_REPORTED: "non riportato ",
    POOR: "scarso",
    UNRELIABLE: "cifre inaffidabili",
  },
  DepositCoverage: {
    FROM_11_TO_25: "dal 11% al 25%",
    FROM_26_TO_50: "dal 26% al 50%",
    FROM_51_TO_100: "dal 51% al 100%",
    LESS_10: "meno del 10%",
    NOT_REPORTED: "non riportato",
  },
  DepositThickness: {
    CLOSED: "chiusa",
    LESS_1_MM: "meno di 1 mm",
    NOT_REPORTED: "non riportato",
    THICKNESS_10: "10 cm",
    THICKNESS_15: "15 cm",
    THICKNESS_20: "20 cm",
    THICKNESS_25: "25 cm",
    THICKNESS_30: "30 cm",
    THICKNESS_35: "35 cm",
    THICKNESS_40: "40 cm",
  },
  DepositType: {
    CLEAR_DRY: "pulita e asciutta",
    COMPACTED_SNOW: "neve compatta",
    DAMP: "umido",
    DRY_SNOW: "neve asciutta",
    FROZEN_RIDGES: "solchi o creste congelate",
    ICE: "ghiaccio",
    NOT_REPORTED: "non riportato",
    RIME_FROST_COVERED: "ricoperta di brina",
    WET_SNOW: "neve bagnata",
    WET_WATER_PATCHES: "pozzanghere bagnate",
  },
  Descriptive: {
    BC: "banchi di nebbia",
    BL: "sollevamento alto",
    DR: "sollevamento basso",
    FZ: "congelantesi",
    MI: "strati di nebbia",
    PR: "parziale",
    SH: "rovescio",
    TS: "temporale",
  },
  Error: {
    prefix: "Si è verificato un errore. Errore nr. ",
  },
  ErrorCode: {
    AirportNotFound: "L’aeroporto non è stato trovato in questa notifica",
    InvalidMessage: "Il messaggio non è valido",
  },
  Indicator: {
    M: "minore di",
    P: "maggiore di",
  },
  Intensity: {
    "-": "Debole",
    VC: "Nelle vicinanze",
  },
  "intensity-plus": "Forte",
  MetarFacade: {
    InvalidIcao: "Codice ICAO non valido",
  },
  Phenomenon: {
    BR: "foschia",
    DS: "tempesta di polvere ",
    DU: "polvere su un’area estesa",
    DZ: "pioviggine",
    FC: "tornado o tromba marina",
    FG: "nebbia",
    FU: "fumo",
    GR: "grandine",
    GS: "grandine piccola e/o granuli di neve",
    HZ: "caligine",
    IC: "cristalli di ghiaccio",
    PL: "granuli di ghiaccio",
    PO: "mulinelli di polvere/sabbia",
    PY: "schizzi",
    RA: "pioggia",
    SA: "sabbia",
    SG: "neve granulosa",
    SN: "neve",
    SQ: "groppo",
    SS: "tempesta di sabbia",
    TS: "temporale",
    UP: "precipitazione sconosciuta",
    VA: "cenere vulcanica",
  },
  Remark: {
    AO1: "stazioni automatizzate senza discriminatore di precipitazione",
    AO2: "stazione automatizzata con discriminatore di precipitazione",
    BASED: "basato",
    Ceiling: {
      Height: "base delle nubi tra {0} e {1} piedi",
      Second: {
        Location:
          "base delle nubi di {0} piedi misurato da un secondo sensore situato a {1}",
      },
    },
    FCST: "previsione",
    FUNNELCLOUD: "nuvole a imbuto",
    Hail: {
      "0": "chicchi di grandine più grandi con un diametro di {0} pollici",
      LesserThan:
        "chicchi di grandine più grandi con un diametro inferiore di {0} pollici",
    },
    HVY: "pesante",
    LGT: "leggero",
    MOD: "moderato",
    NXT: "prossimo",
    Obscuration: "{0} strato a {1} piedi composto da {2}",
    ON: "on",
    PeakWind: "picco di vento di {1} nodi da {0} gradi a {2}:{3}",
    Precipitation: {
      Beg: {
        End: "{0} {1} inizia a {2}:{3} e termina a {4}:{5}",
      },
    },
    PRESFR: "pressione in caduta rapidamente ",
    PRESRR: "pressione in salita rapidamente",
    Sea: {
      Level: {
        Pressure: "pressione a livello del mare di {0} HPa",
      },
    },
    Second: {
      Location: {
        Visibility:
          "visibilità di {0} SM misurata da un secondo sensore situato a {1}",
      },
    },
    Sector: {
      Visibility: "visibilità di {1} SM in direzione {0}",
    },
    SLPNO: "pressione a livello del mare non disponibile",
    Snow: {
      Increasing: {
        Rapidly:
          "aumento dell’altezza della neve di {0} pollici nell’ultima ora con un’altezza totale al suolo di {1} pollici",
      },
      Pellets: "{0} neve tonda ",
    },
    Surface: {
      Visibility: "visibilità in superficie di {0} Statute Miles",
    },
    Thunderstorm: {
      Location: {
        "0": "temporale {0} dalla stazione",
        Moving: "temporale {0} dalla stazione si muove in direzione di {1}",
      },
    },
    Tornadic: {
      Activity: {
        BegEnd:
          "{0} inizia a {1}:{2} e termina a {3}:{4} {5} SM {6} dalla stazione",
        Beginning: "{0} inizia a {1}:{2} {3} SM {4} dalla stazione",
        Ending: "{0} termina a {1}:{2} {3} SM {4} dalla stazione",
      },
    },
    TORNADO: "tornado",
    Tower: {
      Visibility: "visibilità dalla torre di controllo di {0} Statute Miles",
    },
    Variable: {
      Prevailing: {
        Visibility: "visibilità prevalentemente variabile tra {0} e {1} SM",
      },
      Sky: {
        Condition: {
          "0": "strato di nuvole che varia tra {0} e {1}",
          Height: "strato di nubi a {0} piedi che varia tra {1} e {2}",
        },
      },
    },
    VIRGA: "virga",
    Virga: {
      Direction: "virga {0} dalla stazione",
    },
    WATERSPOUT: "tromba marina",
    WindShift: {
      "0": "spostamento del vento a {0}:{1}",
      FROPA:
        "spostamento del vento accompagnato da passaggio frontale a {0}:{1}",
    },
  },
  TimeIndicator: {
    AT: "alle",
    FM: "dalle",
    TL: "fino alle",
  },
  ToString: {
    airport: "aeroporto",
    altimeter: "altimetro (hPa)",
    amendment: "emendamento",
    auto: "auto",
    cavok: "cavok",
    clouds: "nuvole",
    day: {
      hour: "ora del giorno",
      month: "giorno del mese",
    },
    deposit: {
      braking: "capacità frenante",
      coverage: "copertura",
      thickness: "spessore",
      type: "tipo di deposito",
    },
    descriptive: "descrittivo",
    dew: {
      point: "punto di rugiada",
    },
    end: {
      day: {
        month: "ultimo giorno del mese",
      },
      hour: {
        day: "ultima ora del giorno",
      },
    },
    height: {
      feet: "altezza (ft)",
      meter: "altezza (m)",
    },
    indicator: "indicatore",
    intensity: "intensità",
    message: "messaggio originale",
    name: "nome",
    nosig: "nosig",
    phenomenons: "fenomeni",
    probability: "probabilità",
    quantity: "quantità",
    remark: "remark",
    report: {
      time: "ora del rapporto",
    },
    runway: {
      info: "informazioni sulle piste",
    },
    start: {
      day: {
        month: "primo giorno del mese",
      },
      hour: {
        day: "prima ora del giorno",
      },
      minute: "minuto di inizio",
    },
    temperature: {
      "0": "temperatura (°C)",
      max: "temperatura massima (°C)",
      min: "temperatura minima (°C)",
    },
    trend: "tendenza",
    trends: "tendenze",
    type: "tipo",
    vertical: {
      visibility: "visibilità verticale (ft)",
    },
    visibility: {
      main: "visibilità principale",
      max: "visibilità massima",
      min: {
        "0": "visibilità minima",
        direction: "direzione visibilità minima",
      },
    },
    weather: {
      conditions: "condizioni meteo",
    },
    wind: {
      direction: {
        "0": "direzione",
        degrees: "direzione (gradi)",
      },
      gusts: "raffiche",
      max: {
        variation: "variazione massima del vento",
      },
      min: {
        variation: "variazione minima del vento",
      },
      speed: "velocità",
      unit: "unità",
    },
  },
  WeatherChangeType: {
    BECMG: "Diventa",
    FM: "Da",
    PROB: "Probabilità",
    TEMPO: "Temporanea",
  },
};
