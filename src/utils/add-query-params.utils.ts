export const addQueryParams = (
  baseUrl: string,
  // eslint-disable-next-line
  params: Record<string, any>,
): string => {
  const queryString = Object.keys(params)
    .filter((key) => {
      const value = params[key];
      return (
        value !== undefined &&
        value !== null &&
        !(typeof value === "string" && value.trim() === "") &&
        !(Array.isArray(value) && value.length === 0)
      );
    })
    .flatMap((key) => {
      const value = params[key];
      if (Array.isArray(value)) {
        return value.map((val) => `${key}=${encodeURIComponent(val)}`);
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join("&");

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};
