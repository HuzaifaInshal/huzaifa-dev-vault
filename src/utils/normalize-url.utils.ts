export const normalizeUrl = (url: string) => {
  if (!url) {
    return url;
  }
  if (!/^https?:\/\//i.test(url.trim())) {
    return `https://${url}`;
  }
  return url.trim();
};
