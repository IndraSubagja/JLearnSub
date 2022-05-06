export default function shuffle(arr) {
  const res = [...arr];

  for (let i = arr.length - 1; i >= 0; i--) {
    const rand = Math.floor(Math.random() * i);
    [res[i], res[rand]] = [res[rand], res[i]];
  }

  return res;
}
