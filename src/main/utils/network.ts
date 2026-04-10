import https from "https";

export function checkInternetConnection(): Promise<boolean> {
  return new Promise((resolve) => {
    https
      .get("https://www.google.com", (res) => resolve(res.statusCode === 200))
      .on("error", () => resolve(false));
  });
}