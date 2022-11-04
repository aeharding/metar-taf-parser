import styled from "@emotion/styled";
import { ICloud, Visibility } from "metar-taf-parser";
import {
  FlightCategory,
  getFlightCategory,
  getFlightCategoryCssColor,
} from "../helpers/metarTaf";

const Category = styled.div<{ category: FlightCategory }>`
  display: inline-block;
  padding: 2px 8px;

  color: white;
  border-radius: 1rem;
  font-weight: 500;

  background: ${({ category }) => getFlightCategoryCssColor(category)};

  &:after {
    content: "${({ category }) => FlightCategory[category]}";
  }
`;
interface CodeProps {
  visibility: Visibility | undefined;
  clouds: ICloud[];
  verticalVisibility: number | undefined;
}

export default function Code({
  visibility,
  clouds,
  verticalVisibility,
}: CodeProps) {
  const code = getFlightCategory(visibility, clouds, verticalVisibility);

  return <Category category={code} />;
}
