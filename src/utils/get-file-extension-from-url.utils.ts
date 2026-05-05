export function getFileExtensionFromUrl(url: string): string {
  const cleanedUrl = url.split("?")[0].split("#")[0];

  const parts = cleanedUrl.trim().split("/");
  const filename = parts[parts.length - 1];

  if (filename && filename.includes(".")) {
    const extensionParts = filename.split(".");
    const extension = extensionParts[extensionParts.length - 1];

    return extension.trim().toLowerCase() || "";
  }

  return "";
}
