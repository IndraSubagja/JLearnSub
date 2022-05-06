export default function formatBytes(value, precision = 2, size = 1024) {
  const unit = Math.floor(Math.log(value) / Math.log(size));
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  return !value
    ? '0 Bytes'
    : `${parseFloat((value / Math.pow(size, unit)).toFixed(Math.max(0, precision)))} ${units[unit]}`;
}
