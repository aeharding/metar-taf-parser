import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import reactTextareaAutosize from "react-textarea-autosize";
import { parseMetar, IMetar } from "metar-taf-parser";
import ReactJson from "react-json-view";
import Error from "./Error";
import { useNavigate } from "react-router";
import { createSearchParams, useSearchParams } from "react-router-dom";

// Types are broke
const Json = ReactJson as any;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 1rem;
  margin-top: 1.5rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: inherit;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  background: none;
  color: inherit;
  white-space: nowrap;
  margin-right: 0.5rem;
  cursor: pointer;
`;

const Textarea = styled(reactTextareaAutosize)`
  width: 100%;
  min-height: 50px;

  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  resize: none;
  padding: 1rem;
  color: inherit;
  font-family: monospace;
`;

const JsonContainer = styled.div`
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;

  overflow: hidden;

  .react-json-view {
    padding: 1rem;
    width: 100%;
  }
`;

const EXAMPLE =
  "KTTN 051853Z 04011KT 1 1/2SM VCTS SN FZFG BKN003 OVC010 M02/M02 A3006 RMK AO2 TSB40 SLP176 P0002 T10171017=";

export default function Parse() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(search.get("input") || "");
  const [metar, setMetar] = useState<IMetar | undefined>();
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    try {
      if (input) setMetar(parseMetar(input));
      else setMetar(undefined);

      setError(undefined);
    } catch (e) {
      setError(e as Error);
      setMetar(undefined);
      console.error(e);
    }

    navigate(
      { search: input ? createSearchParams({ input }).toString() : undefined },
      { replace: true }
    );
  }, [input, navigate]);

  return (
    <Container>
      <InputContainer>
        <div>
          <Button onClick={() => setInput(EXAMPLE)}>Autofill example</Button>
          <Button onClick={() => setInput("")}>Clear</Button>
        </div>
        <Textarea
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
          placeholder="Enter METAR string"
        />
      </InputContainer>

      {error && <Error error={error} />}

      <JsonContainer>
        <Json src={metar} theme="harmonic" enableClipboard={false} />
      </JsonContainer>
    </Container>
  );
}
