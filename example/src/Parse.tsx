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

const Button = styled.button``;

const Textarea = styled(reactTextareaAutosize)`
  width: 100%;
  max-width: 400px;
  min-height: 50px;
`;

const EXAMPLE =
  "METAR KTTN 051853Z 04011KT 1 1/2SM VCTS SN FZFG BKN003 OVC010 M02/M02 A3006 RMK AO2 TSB40 SLP176 P0002 T10171017=";

export default function Parse() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(search.get("input") || undefined);
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
    <>
      <Button onClick={() => setInput(EXAMPLE)}>Autofill example</Button>
      <br />
      <Textarea
        onChange={(e) => {
          setInput(e.target.value);
        }}
        value={input}
        placeholder="Enter METAR"
      />

      {error && <Error error={error} />}

      <Json src={metar} />
    </>
  );
}
