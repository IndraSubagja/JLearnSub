export default function generateFileName(prefix, format) {
  const value = new Date();
  const date = value.toLocaleDateString().split('/').join('');
  const time = value.toLocaleTimeString('default', { timeStyle: 'medium', hour12: false }).split(':').join('');
  return `${prefix}_${date}_${time}.${format}`;
}
