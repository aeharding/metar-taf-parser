import styled from "@emotion/styled";

const Container = styled.div`
  background: red;
  color: white;
`;

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  return <Container>{error.message}</Container>;
}
