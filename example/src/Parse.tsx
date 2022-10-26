import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import reactTextareaAutosize from "react-textarea-autosize";
import {
  parseMetar,
  Locale,
  parseTAF,
  IMetarTAFParserOptions,
  parseTAFAsForecast,
  IMetarTAFParserOptionsDated,
} from "metar-taf-parser";
import ReactJson from "react-json-view";
import ErrorComponent from "./Error";
import { useNavigate } from "react-router";
import { createSearchParams, useSearchParams } from "react-router-dom";
import en from "metar-taf-parser/locale/en";
import fr from "metar-taf-parser/locale/fr";
import de from "metar-taf-parser/locale/de";
import it from "metar-taf-parser/locale/it";
import pl from "metar-taf-parser/locale/pl";
import zh from "metar-taf-parser/locale/zh-CN";
import { css } from "@emotion/react";
import format from "date-fns/format";
import { omitByDeep } from "./helpers/omitByDeep";

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

const OptionsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const common = css`
  font-size: inherit;
  height: 40px;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  appearance: none;
  background: none;
  color: inherit;
`;

const Button = styled.button`
  ${common}

  white-space: nowrap;
  cursor: pointer;
`;

const Select = styled.select`
  ${common}

  padding-right: 2.5rem;
  border-radius: 1.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512' width='8'%3E%3Cpath d='M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z' fill='rgba(255, 255, 255, 0.25)'/%3E%3C/svg%3E");
  background-position: 87%;
  background-repeat: no-repeat;

  option {
    color: black;
  }
`;

const Input = styled.input`
  ${common}

  font-family: inherit;

  ::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
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
  font-size: inherit;
  outline: 0;

  &:focus {
    border-color: #056fc6;
  }
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

const METAR_EXAMPLE =
  "KTTN 051853Z 04011KT 1 1/2SM VCTS SN FZFG BKN003 OVC010 M02/M02 A3006 RMK AO2 TSB40 SLP176 P0002 T10171017=";

const TAF_EXAMPLE = `
TAF FALE 252200Z 2600/2706 22008KT 9999 BKN020 TX22/2612Z TN19/2603Z
  PROB30
  TEMPO 2606/2618 5000 -RA BKN010
  BECMG 2610/2612 12010KT
  FM262200 VRB03KT CAVOK
  BECMG 2704/2706 03010KT
  `.trim();

const langs = [
  { name: "en", locale: en, label: "🇬🇧 English" },
  { name: "fr", locale: fr, label: "🇫🇷 Français" },
  { name: "de", locale: de, label: "🇳🇱 Nederlands" },
  { name: "it", locale: it, label: "🇮🇹 Italiano" },
  { name: "pl", locale: pl, label: "🇵🇱 Polskie" },
  { name: "zh", locale: zh, label: "🇨🇳 中国人" },
];

function findLocale(selectedName: string): Locale | undefined {
  return langs.find(({ name }) => name === selectedName)?.locale;
}

export function ParseMetar() {
  return (
    <Parse entityName="METAR" parse={parseMetar} example={METAR_EXAMPLE} />
  );
}

export function ParseTAF() {
  return <Parse entityName="TAF" parse={parseTAF} example={TAF_EXAMPLE} />;
}

export function ParseTAFAsForecast() {
  return (
    <Parse
      entityName="TAF"
      parse={(message, { issued }) => {
        if (!issued)
          throw new Error("parseTAFAsForecast requires an issued date");

        return parseTAFAsForecast(message, { issued });
      }}
      example={TAF_EXAMPLE}
      initialDate={new Date("2022-10-25")}
    ></Parse>
  );
}

interface ParseProps<T extends () => unknown> {
  entityName: string;
  parse: (
    message: string,
    options: Partial<Pick<IMetarTAFParserOptionsDated, "issued">> &
      IMetarTAFParserOptions
  ) => ReturnType<T>;
  example: string;
  initialDate?: Date;
}

function Parse<T extends () => unknown>({
  entityName,
  parse,
  example: EXAMPLE,
  initialDate,
}: ParseProps<T>) {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(search.get("input") || "");
  const [result, setResult] = useState<any>();
  const [error, setError] = useState<Error | undefined>();
  const [lang, setLang] = useState("en");

  const formatString = "yyyy-M-dd";
  const [issued, setIssued] = useState(
    initialDate ? format(initialDate, formatString) : undefined
  );

  useEffect(() => {
    try {
      if (input)
        setResult(
          parse?.(input, {
            locale: findLocale(lang),
            issued: issued ? new Date(issued) : undefined,
          })
        );
      else setResult(undefined);

      setError(undefined);
    } catch (e) {
      setError(e as Error);
      setResult(undefined);
      console.error(e);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, navigate, lang, parse, issued]);

  useEffect(() => {
    setInput(search.get("input") || "");
  }, [search]);

  useEffect(() => {
    (window as any).result = result;
  }, [result]);

  function inputChange(input: string) {
    setInput(input);
    navigate(
      { search: input ? createSearchParams({ input }).toString() : undefined },
      { replace: true }
    );
  }

  return (
    <>
      <Container>
        <InputContainer>
          <OptionsBar>
            <Button onClick={() => inputChange(EXAMPLE)}>
              Autofill example
            </Button>
            <Button onClick={() => inputChange("")}>Clear</Button>
            <Select value={lang} onChange={(e) => setLang(e.target.value)}>
              {langs.map((lang) => (
                <option key={lang.name} value={lang.name}>
                  {lang.label}
                </option>
              ))}
            </Select>

            <Input
              type="date"
              value={issued}
              onChange={(e) => setIssued(e.target.value)}
              title="Issued date (approximate), used to determine year & month of TAF/METAR"
            />
          </OptionsBar>
          <Textarea
            onChange={(e) => {
              inputChange(e.target.value);
            }}
            value={input}
            placeholder={`Enter ${entityName} string`}
            autoFocus
          />
        </InputContainer>

        {error && <ErrorComponent error={error} />}

        <JsonContainer>
          <Json
            // Hide undefined values from displaying
            src={omitByDeep(result, (v) => v === undefined)}
            theme="harmonic"
            enableClipboard={false}
          />
        </JsonContainer>
      </Container>
    </>
  );
}
