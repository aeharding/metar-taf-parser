import styled from "@emotion/styled";

const Container = styled.div`
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 0, 0, 0.3);
  border: 1px solid red;
  color: white;
  font-family: monospace;
`;

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  return (
    <Container>
      {error.name}: {error.message}
    </Container>
  );
}
