import styled from "@emotion/styled";
import { Visibility } from "metar-taf-parser";

enum FlightCategory {
  VFR = "VFR",
  MVFR = "MVFR",
  IFR = "IFR",
  LIFR = "LIFR",
}

const FlightCategoryEl = styled.div<{ flightCategory: FlightCategory }>`
  padding: 2px 5px;
  border-radius: 5px;

  background-color: ${({ flightCategory }) => {
    switch (flightCategory) {
      case FlightCategory.VFR:
        return "#00ac00";
      case FlightCategory.MVFR:
        return "#026bdb";
      case FlightCategory.IFR:
        return "red";
      case FlightCategory.LIFR:
        return "purple";
    }
  }};

  &:after {
    content: "${({ flightCategory }) => FlightCategory[flightCategory]}";
  }
`;

interface CodeProps {
  visibility: Visibility | undefined;
  ceiling: number | undefined;
}

export default function Code({ visibility, ceiling }: CodeProps) {
  const distance = visibility?.value != null ? visibility?.value : Infinity;
  const height = ceiling != null ? ceiling : Infinity;

  let flightCategory = FlightCategory.VFR;

  if (height <= 3000 || distance <= 5) flightCategory = FlightCategory.MVFR;
  if (height <= 1000 || distance <= 3) flightCategory = FlightCategory.IFR;
  if (height <= 500 || distance <= 1) flightCategory = FlightCategory.LIFR;

  return <FlightCategoryEl flightCategory={flightCategory} />;
}
