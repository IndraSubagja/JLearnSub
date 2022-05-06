export const getMeaning = (vocab) =>
  [
    vocab["English"],
    vocab["Kana Meaning"],
    vocab["Alternative Meanings"],
    vocab["Kana Alternative Meaning"],
  ].filter((meaning) => meaning);

export const getKanjiFromReading = (reading) => {
  if (!reading || reading.indexOf("[") === -1) return reading;

  let res = "";
  let furiganaState = false;

  for (let i = 0; i < reading.length; i++) {
    if (reading[i] === "[") {
      furiganaState = true;
    } else if (reading[i] === "]") {
      furiganaState = false;
    } else if (!furiganaState) {
      res += reading[i];
    }
  }

  return res;
};

export const getReading = (vocab) => {
  const reading = [];
  vocab["Reading"] && reading.push(getKanjiFromReading(vocab["Reading"]));
  vocab["Kana?"] === "y" && reading.push("Commonly Kana");

  return reading.join(" - ");
};

export const getAudioSrc = (str) => str?.replace("[sound:", "");

export const getAudio = (vocab) => {
  return getAudioSrc(vocab["Kanji Audio"]) || getAudioSrc(vocab["Kana Audio"]);
};

export const createFurigana = (str) => {
  const isKanji = (char) => {
    return (
      (char >= "\u4e00" && char <= "\u9faf") ||
      (char >= "\u3400" && char <= "\u4dbf") ||
      char === "\u3005"
    );
  };
  const isKana = (char) => {
    return (
      (char >= "\u3040" && char <= "\u309f") ||
      (char >= "\u30a0" && char <= "\u30ff")
    );
  };

  const res = [];
  let furiganaState = null;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === "[") {
      furiganaState = true;
    } else if (str[i] === "]") {
      furiganaState = false;
    } else if (isKanji(str[i])) {
      (i === 0 || !Array.isArray(res[res.length - 1])) && res.push(["", ""]);
      res[res.length - 1][0] += str[i];
    } else if (isKana(str[i]) && furiganaState) {
      Array.isArray(res[res.length - 1]) && (res[res.length - 1][1] += str[i]);
    } else {
      (i === 0 || Array.isArray(res[res.length - 1])) && res.push("");
      res[res.length - 1] += str[i];
    }
  }

  return res.reduce(
    (a, b) =>
      a +
      (Array.isArray(b)
        ? `<ruby>
              ${b[0]} <rp>(</rp><rt>${b[1]}</rt><rp>)</rp>
            </ruby>`
        : b),
    ""
  );
};

export const removeFurigana = (str) => {
  let res = "";
  let furiganaState = null;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === "[") {
      furiganaState = true;
    } else if (str[i] === "]") {
      furiganaState = false;
    } else if (!furiganaState) {
      res += str[i];
    }
  }

  return res;
};
