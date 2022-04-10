import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

const TabContainer = styled.div`
  display: flex;
  margin: 2rem 0 0;
`;

const Tab = styled(NavLink)`
  padding: 1rem;
  text-decoration: none;

  font-size: 1.1rem;
  font-weight: 300;
  min-width: 7rem;
  text-align: center;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;

  border: 1px solid transparent;
  border-bottom-color: rgba(255, 255, 255, 0.25);

  &.active {
    border-color: rgba(255, 255, 255, 0.25);
    border-bottom-color: transparent;
    cursor: inherit;
    pointer-events: none;
  }

  &:hover:not(.active) {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const Rest = styled.div`
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);

  &:not(:last-child) {
    min-width: 1rem;
    flex: 0;
  }
`;

export default function Tabs() {
  return (
    <TabContainer>
      <Rest />
      <Tab to={{ pathname: "/metar", search: "" }}>METAR</Tab>
      <Rest />
      <Tab to={{ pathname: "/taf", search: "" }}>TAF</Tab>
      <Rest />
    </TabContainer>
  );
}
