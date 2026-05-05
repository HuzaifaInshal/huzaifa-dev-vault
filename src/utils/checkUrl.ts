/**
 * will return true if the given string is url else return false
 */
export function checkIfUrl(str: string) {
  return /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/.test(str);
}

export function checkIfImageUrl(url: string): boolean {
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;
  return imageExtensions.test(url);
}
