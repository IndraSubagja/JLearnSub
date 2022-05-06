export default function getLastTime(date, isShort = false) {
  let now = Date.now();
  let time = new Date(date).getTime();

  let distance = now - time;
  let res;

  if (!Math.floor(distance / 1000)) {
    // Less than a second
    return 'Just now';
  } else if (!Math.floor(distance / 1000 / 60)) {
    // Less than a minute
    res = Math.floor(distance / 1000) % 60;
    return `${res}${isShort ? 's' : ` second${res > 1 ? 's' : ''} ago`}`;
  } else if (!Math.floor(distance / 1000 / 60 / 60)) {
    // Less than an hour
    res = Math.floor(distance / 1000 / 60) % 60;
    return `${res}${isShort ? 'm' : ` minute${res > 1 ? 's' : ''} ago`}`;
  } else if (!Math.floor(distance / 1000 / 60 / 60 / 24)) {
    // Less than a day
    res = Math.floor(distance / 1000 / 60 / 60) % 24;
    return `${res}${isShort ? 'h' : ` hour${res > 1 ? 's' : ''} ago`}`;
  } else if (!Math.floor(distance / 1000 / 60 / 60 / 24 / 7)) {
    // Less than a week
    res = Math.floor(distance / 1000 / 60 / 60 / 24) % 7;
    return `${res}${isShort ? 'd' : ` day${res > 1 ? 's' : ''} ago`}`;
  } else if (!Math.floor(distance / 1000 / 60 / 60 / 24 / 7 / 4)) {
    // Less than a month
    res = Math.floor(distance / 1000 / 60 / 60 / 24 / 7) % 4;
    return `${res}${isShort ? 'w' : ` week${res > 1 ? 's' : ''} ago`}`;
  } else if (!Math.floor(distance / 1000 / 60 / 60 / 24 / 7 / 4 / 12)) {
    // Less than a year
    res = Math.floor(distance / 1000 / 60 / 60 / 24 / 7 / 4) % 12;
    return `${res}${isShort ? 'mo' : `month${res > 1 ? 's' : ''} ago`}`;
  } else {
    // More than a year
    res = Math.floor(distance / 1000 / 60 / 60 / 24 / 7 / 4 / 12);
    return `${res}${isShort ? 'y' : ` year${res > 1 ? 's' : ''} ago`}`;
  }
}
