import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const AIRPORTS_LIST = [
  "KPDX",
  "EHAM",
  "KMSN",
  "SAWH",
  "DNMM",
  "VOMM",
  "PGUM",
  "YBBN",
];

export default function FindForecast() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  function onSubmit(e: FormEvent) {
    if (!search || !/^[a-zA-Z1-9]{3,4}$/.test(search)) {
      e.preventDefault();
      return;
    }

    let code = search.toUpperCase();
    if (code.length === 3) code = `K${code}`;

    navigate(`/forecast/${code}`);
  }

  return (
    <>
      <ul>
        {AIRPORTS_LIST.map((code) => (
          <li key={code}>
            <Link to={`/forecast/${code}`}>{code}</Link>
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          placeholder="ICAO airport code"
        />

        <button type="submit">Go</button>
      </form>
    </>
  );
}
