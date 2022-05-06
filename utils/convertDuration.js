export default function convertDuration(duration) {
  const minute = Math.floor(duration / 60);
  const second = duration % 60;
  return `${minute} : ${second < 10 ? '0' + second : second}`;
}
