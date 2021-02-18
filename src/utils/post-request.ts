import https from "https";

export default async function makePostRequest<T = unknown>(
  url: string,
  bodyString: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": bodyString.length,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (d: Buffer) => {
          data += d.toString();
        });

        res.on("error", reject);

        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      }
    );

    req.on("error", reject);
    req.write(bodyString);
    req.end();
  });
}
