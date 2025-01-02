import { _, Locale } from "commons/i18n";
import {
  CeilingHeightCommand,
  ICeilingHeightRemark,
} from "./remark/CeilingHeightCommand";
import {
  CeilingSecondLocationCommand,
  ICeilingSecondLocationRemark,
} from "./remark/CeilingSecondLocationCommand";
import { HailSizeCommand, IHailSizeRemark } from "./remark/HailSizeCommand";
import {
  HourlyMaximumMinimumTemperatureCommand,
  IHourlyMaximumMinimumTemperatureRemark,
} from "./remark/HourlyMaximumMinimumTemperatureCommand";
import {
  HourlyMaximumTemperatureCommand,
  IHourlyMaximumTemperatureRemark,
} from "./remark/HourlyMaximumTemperatureCommand";
import {
  HourlyMinimumTemperatureCommand,
  IHourlyMinimumTemperatureRemark,
} from "./remark/HourlyMinimumTemperatureCommand";
import {
  HourlyPrecipitationAmountCommand,
  IHourlyPrecipitationAmountRemark,
} from "./remark/HourlyPrecipitationAmountCommand";
import {
  HourlyPressureCommand,
  IHourlyPressureRemark,
} from "./remark/HourlyPressureCommand";
import {
  HourlyTemperatureDewPointCommand,
  IHourlyTemperatureDewPointRemark,
} from "./remark/HourlyTemperatureDewPointCommand";
import {
  IceAccretionCommand,
  IIceAccretionRemark,
} from "./remark/IceAccretionCommand";
import {
  ObscurationCommand,
  IObscurationRemark,
} from "./remark/ObscurationCommand";
import {
  PrecipitationAmount24HourCommand,
  IPrecipitationAmount24HourRemark,
} from "./remark/PrecipitationAmount24HourCommand";
import {
  PrecipitationAmount36HourCommand,
  IPrecipitationAmount36HourRemark,
} from "./remark/PrecipitationAmount36HourCommand";
import {
  PrecipitationBegEndCommand,
  IPrecipitationBegEndRemark,
} from "./remark/PrecipitationBegEndCommand";
import {
  PrevailingVisibilityCommand,
  IPrevailingVisibilityRemark,
} from "./remark/PrevailingVisibilityCommand";
import {
  SeaLevelPressureCommand,
  ISeaLevelPressureRemark,
} from "./remark/SeaLevelPressureCommand";
import {
  SecondLocationVisibilityCommand,
  ISecondLocationVisibilityRemark,
} from "./remark/SecondLocationVisibilityCommand";
import {
  SectorVisibilityCommand,
  ISectorVisibilityRemark,
} from "./remark/SectorVisibilityCommand";
import {
  SmallHailSizeCommand,
  ISmallHailSizeRemark,
} from "./remark/SmallHailSizeCommand";
import { SnowDepthCommand, ISnowDepthRemark } from "./remark/SnowDepthCommand";
import {
  SnowIncreaseCommand,
  ISnowIncreaseRemark,
} from "./remark/SnowIncreaseCommand";
import {
  SnowPelletsCommand,
  ISnowPelletsRemark,
} from "./remark/SnowPelletsCommand";
import {
  SunshineDurationCommand,
  ISunshineDurationRemark,
} from "./remark/SunshineDurationCommand";
import {
  SurfaceVisibilityCommand,
  ISurfaceVisibilityRemark,
} from "./remark/SurfaceVisibilityCommand";
import {
  ThunderStormLocationCommand,
  IThunderStormLocationRemark,
} from "./remark/ThunderStormLocationCommand";
import {
  ThunderStormLocationMovingCommand,
  IThunderStormLocationMovingRemark,
} from "./remark/ThunderStormLocationMovingCommand";
import {
  ITornadicActivityBegRemark,
  TornadicActivityBegCommand,
} from "./remark/TornadicActivityBegCommand";
import {
  TornadicActivityBegEndCommand,
  ITornadicActivityBegEndRemark,
} from "./remark/TornadicActivityBegEndCommand";
import {
  TornadicActivityEndCommand,
  ITornadicActivityEndRemark,
} from "./remark/TornadicActivityEndCommand";
import {
  TowerVisibilityCommand,
  ITowerVisibilityRemark,
} from "./remark/TowerVisibilityCommand";
import {
  VariableSkyCommand,
  IVariableSkyRemark,
} from "./remark/VariableSkyCommand";
import {
  VariableSkyHeightCommand,
  IVariableSkyHeightRemark,
} from "./remark/VariableSkyHeightCommand";
import {
  VirgaDirectionCommand,
  IVirgaDirectionRemark,
} from "./remark/VirgaDirectionCommand";
import {
  WaterEquivalentSnowCommand,
  IWaterEquivalentSnowRemark,
} from "./remark/WaterEquivalentSnowCommand";
import {
  WindPeakCommand,
  IWindPeakCommandRemark,
} from "./remark/WindPeakCommandCommand";
import { WindShiftCommand, IWindShiftRemark } from "./remark/WindShiftCommand";
import {
  WindShiftFropaCommand,
  IWindShiftFropaRemark,
} from "./remark/WindShiftFropaCommand";
import { Command } from "./remark/Command";
import { DefaultCommand, IDefaultCommandRemark } from "./remark/DefaultCommand";
import {
  IPrecipitationBegRemark,
  PrecipitationBegCommand,
} from "./remark/PrecipitationBegCommand";
import {
  IPrecipitationEndRemark,
  PrecipitationEndCommand,
} from "./remark/PrecipitationEndCommand";
import {
  INextForecastByRemark,
  INextForecastByRemarkDated,
  NextForecastByCommand,
} from "command/remark/NextForecastByCommand";

export type {
  ICeilingHeightRemark,
  ICeilingSecondLocationRemark,
  IHourlyMaximumMinimumTemperatureRemark,
  IHourlyMaximumTemperatureRemark,
  IHourlyMinimumTemperatureRemark,
  IHourlyPrecipitationAmountRemark,
  IHourlyPressureRemark,
  IHourlyTemperatureDewPointRemark,
  IIceAccretionRemark,
  IObscurationRemark,
  IPrecipitationAmount24HourRemark,
  IPrecipitationAmount36HourRemark,
  IPrecipitationBegEndRemark,
  IPrevailingVisibilityRemark,
  ISeaLevelPressureRemark,
  ISecondLocationVisibilityRemark,
  ISectorVisibilityRemark,
  ISmallHailSizeRemark,
  ISnowIncreaseRemark,
  ISnowPelletsRemark,
  ISunshineDurationRemark,
  ISurfaceVisibilityRemark,
  IThunderStormLocationRemark,
  IThunderStormLocationMovingRemark,
  ITornadicActivityBegRemark,
  ITornadicActivityBegEndRemark,
  ITornadicActivityEndRemark,
  ITowerVisibilityRemark,
  IVariableSkyRemark,
  IVariableSkyHeightRemark,
  IVirgaDirectionRemark,
  IWaterEquivalentSnowRemark,
  IWindPeakCommandRemark,
  IWindShiftFropaRemark,
  INextForecastByRemark,
  INextForecastByRemarkDated,
};

export interface IBaseRemark {
  type: RemarkType;
  description?: string;
  raw: string;
}

export interface IUnknownRemark extends IBaseRemark {
  type: RemarkType.Unknown;
}

export class RemarkCommandSupplier {
  defaultCommand: Command;
  commandList: Command[];

  constructor(private locale: Locale) {
    this.defaultCommand = new DefaultCommand(locale);
    this.commandList = [
      new WindPeakCommand(locale),
      new WindShiftFropaCommand(locale),
      new WindShiftCommand(locale),
      new TowerVisibilityCommand(locale),
      new SurfaceVisibilityCommand(locale),
      new PrevailingVisibilityCommand(locale),
      new SecondLocationVisibilityCommand(locale),
      new SectorVisibilityCommand(locale),
      new TornadicActivityBegEndCommand(locale),
      new TornadicActivityBegCommand(locale),
      new TornadicActivityEndCommand(locale),
      new PrecipitationBegEndCommand(locale),
      new PrecipitationBegCommand(locale),
      new PrecipitationEndCommand(locale),
      new ThunderStormLocationMovingCommand(locale),
      new ThunderStormLocationCommand(locale),
      new SmallHailSizeCommand(locale),
      new HailSizeCommand(locale),
      new SnowPelletsCommand(locale),
      new VirgaDirectionCommand(locale),
      new CeilingHeightCommand(locale),
      new ObscurationCommand(locale),
      new VariableSkyHeightCommand(locale),
      new VariableSkyCommand(locale),
      new CeilingSecondLocationCommand(locale),
      new SeaLevelPressureCommand(locale),
      new SnowIncreaseCommand(locale),
      new HourlyMaximumMinimumTemperatureCommand(locale),
      new HourlyMaximumTemperatureCommand(locale),
      new HourlyMinimumTemperatureCommand(locale),
      new HourlyPrecipitationAmountCommand(locale),
      new HourlyTemperatureDewPointCommand(locale),
      new HourlyPressureCommand(locale),
      new IceAccretionCommand(locale),
      new PrecipitationAmount36HourCommand(locale),
      new PrecipitationAmount24HourCommand(locale),
      new SnowDepthCommand(locale),
      new SunshineDurationCommand(locale),
      new WaterEquivalentSnowCommand(locale),
      new NextForecastByCommand(locale),
    ];
  }

  get(code: string): Command {
    for (const command of this.commandList) {
      if (command.canParse(code)) return command;
    }

    return this.defaultCommand;
  }
}

export enum RemarkType {
  // Unknown processed with default command
  Unknown = "Unknown",

  // Processed with default command
  AO1 = "AO1",
  AO2 = "AO2",
  PRESFR = "PRESFR",
  PRESRR = "PRESRR",
  TORNADO = "TORNADO",
  FUNNELCLOUD = "FUNNELCLOUD",
  WATERSPOUT = "WATERSPOUT",
  VIRGA = "VIRGA",

  // Regular commands below
  WindPeak = "WindPeak",
  WindShiftFropa = "WindShiftFropa",
  WindShift = "WindShift",
  TowerVisibility = "TowerVisibility",
  SurfaceVisibility = "SurfaceVisibility",
  PrevailingVisibility = "PrevailingVisibility",
  SecondLocationVisibility = "SecondLocationVisibility",
  SectorVisibility = "SectorVisibility",
  TornadicActivityBegEnd = "TornadicActivityBegEnd",
  TornadicActivityBeg = "TornadicActivityBeg",
  TornadicActivityEnd = "TornadicActivityEnd",
  PrecipitationBeg = "PrecipitationBeg",
  PrecipitationBegEnd = "PrecipitationBegEnd",
  PrecipitationEnd = "PrecipitationEnd",
  ThunderStormLocationMoving = "ThunderStormLocationMoving",
  ThunderStormLocation = "ThunderStormLocation",
  SmallHailSize = "SmallHailSize",
  HailSize = "HailSize",
  SnowPellets = "SnowPellets",
  VirgaDirection = "VirgaDirection",
  CeilingHeight = "CeilingHeight",
  Obscuration = "Obscuration",
  VariableSkyHeight = "VariableSkyHeight",
  VariableSky = "VariableSky",
  CeilingSecondLocation = "CeilingSecondLocation",
  SeaLevelPressure = "SeaLevelPressure",
  SnowIncrease = "SnowIncrease",
  HourlyMaximumMinimumTemperature = "HourlyMaximumMinimumTemperature",
  HourlyMaximumTemperature = "HourlyMaximumTemperature",
  HourlyMinimumTemperature = "HourlyMinimumTemperature",
  HourlyPrecipitationAmount = "HourlyPrecipitationAmount",
  HourlyTemperatureDewPoint = "HourlyTemperatureDewPoint",
  HourlyPressure = "HourlyPressure",
  IceAccretion = "IceAccretion",
  PrecipitationAmount36Hour = "PrecipitationAmount36Hour",
  PrecipitationAmount24Hour = "PrecipitationAmount24Hour",
  SnowDepth = "SnowDepth",
  SunshineDuration = "SunshineDuration",
  WaterEquivalentSnow = "WaterEquivalentSnow",

  // Canada commands below
  NextForecastBy = "NextForecastBy",
}

// Remark types that are not date based
type RemarkBase =
  | IUnknownRemark
  | IDefaultCommandRemark
  // Regular commands below
  | ICeilingHeightRemark
  | ICeilingSecondLocationRemark
  | IHailSizeRemark
  | IHourlyMaximumMinimumTemperatureRemark
  | IHourlyMaximumTemperatureRemark
  | IHourlyMinimumTemperatureRemark
  | IHourlyPrecipitationAmountRemark
  | IHourlyPressureRemark
  | IHourlyTemperatureDewPointRemark
  | IIceAccretionRemark
  | IObscurationRemark
  | IPrecipitationAmount24HourRemark
  | IPrecipitationAmount36HourRemark
  | IPrecipitationBegRemark
  | IPrecipitationBegEndRemark
  | IPrecipitationEndRemark
  | IPrevailingVisibilityRemark
  | ISeaLevelPressureRemark
  | ISecondLocationVisibilityRemark
  | ISectorVisibilityRemark
  | ISmallHailSizeRemark
  | ISnowDepthRemark
  | ISnowIncreaseRemark
  | ISnowPelletsRemark
  | ISunshineDurationRemark
  | ISurfaceVisibilityRemark
  | IThunderStormLocationRemark
  | IThunderStormLocationMovingRemark
  | ITornadicActivityBegRemark
  | ITornadicActivityBegEndRemark
  | ITornadicActivityEndRemark
  | ITowerVisibilityRemark
  | IVariableSkyRemark
  | IVariableSkyHeightRemark
  | IVirgaDirectionRemark
  | IWaterEquivalentSnowRemark
  | IWindPeakCommandRemark
  | IWindShiftRemark
  | IWindShiftFropaRemark;

export type RemarkDated =
  | RemarkBase
  // Canadian commands below
  | INextForecastByRemarkDated;

export type Remark =
  | RemarkBase
  // Canadian commands below
  | INextForecastByRemark;
