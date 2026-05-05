export function getFilenameFromUrl(url: string): string {
  if (!url) {
    return "";
  }
  const cleanedUrl = url.split("?")[0].split("#")[0];

  const parts = cleanedUrl.trim().split("/");
  const filename = parts[parts.length - 1];

  return filename ? filename.trim() : url.trim();
}

export function getFilenameFromUrlExtended(url: string): string {
  return getFilenameFromUrl(url).split("Z-").slice(1).join("-");
}
