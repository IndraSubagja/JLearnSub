export default function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}
