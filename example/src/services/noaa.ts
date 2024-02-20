import axios from "axios";

export async function getTAF(icaoId: string): Promise<[Date, string]> {
  // Proxied to https://tgftp.nws.noaa.gov/data/forecasts/taf/stations/KMSN.TXT for CORS

  const { data } = await axios.get(
    `https://dbm5gpona5rkx.cloudfront.net/api/taf/${icaoId}`,
  );

  const [dateLine, ...rest] = data.split("\n");

  return [new Date(dateLine), rest.join("\n")];
}
