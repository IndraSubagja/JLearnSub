export default function waitImageLoad(url, callback, type) {
  if (!type || type !== 'image') return callback();

  const img = new Image();
  img.src = url;
  img.onload = callback;
}
