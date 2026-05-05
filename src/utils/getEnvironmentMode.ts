export function getEnvironmentMode(): "DEV" | "PROD" {
  const modeFromEnv = process.env.NODE_ENV;

  if (modeFromEnv === "development") {
    return "DEV";
  }
  return "PROD";
}
