import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/Vocabs/Lesson.module.css";
import { Context, Info } from "./_components";
import data from "../../data.json";
import {
  getAudio,
  getAudioSrc,
  getMeaning,
  getReading,
} from "../../utils/vocab";

const Vocabs = data.data;

export default function Lesson({ changeMode, indices, setIndices }) {
  const [lessons, setLessons] = useState(null);
  const [state, setState] = useState({ show: null, pos: null });
  const { show, pos } = state;

  const lesson = lessons && lessons[pos];

  const backHandler = () => {
    changeMode("menu");
    setIndices([]);
    localStorage.removeItem("lessonsState");
  };

  const prevHandler = () => {
    const newState = { pos: !show ? pos - 1 : pos, show: !show };
    setState(newState);
    localStorage.setItem("lessonsState", JSON.stringify(newState));
  };
  const nextHandler = () => {
    if (pos === lessons.length - 1 && !!show) {
      changeMode("quiz");
      localStorage.removeItem("lessonsState");
    } else {
      const newState = { pos: show ? pos + 1 : pos, show: !show };
      setState(newState);
      localStorage.setItem("lessonsState", JSON.stringify(newState));
    }
  };

  useEffect(() => {
    const convertIndicesToLessons = (indices) => {
      const lessons = [];

      indices.map((index) => {
        const vocab = Vocabs[index];

        const kanji = vocab["Kanji"];
        const subtitle = vocab["Subtitle"];
        const notes = vocab["Notes"];
        const audio = getAudio(vocab);
        const meaning = getMeaning(vocab);
        const reading = getReading(vocab);
        const kana = vocab["Kana Reading"] || vocab["Reading"];
        const sentence = {
          context: vocab["Context Sentence"],
          meaning: vocab["English Sentence"],
          audio: getAudioSrc(vocab["Audio Sentence"]),
        };

        const lesson = {
          index,
          kanji,
          meaning,
          subtitle,
          notes,
          audio,
          reading,
          kana,
          sentence,
        };
        lessons.push(
          { type: "info", ...lesson, focus: lesson.kanji },
          { type: "context", ...lesson, focus: lesson.sentence.audio }
        );
      });

      return lessons;
    };

    if (!lessons) {
      const lessons = convertIndicesToLessons(indices);
      setLessons(lessons);
    }
  }, [lessons, indices]);

  useEffect(() => {
    const localState = JSON.parse(localStorage.getItem("lessonsState"));
    setState(localState || { show: false, pos: 0 });
  }, []);

  return (
    lesson && (
      <main className={styles.lesson}>
        <div>
          <button type="button" onClick={backHandler}>
            <span>
              <FontAwesomeIcon icon="chevron-left" />
            </span>
            <span>Back to Menu</span>
          </button>

          <h4>
            {pos + 1} / {lessons.length}
          </h4>
        </div>

        <div>
          <button
            type="button"
            disabled={pos === 0 && !show}
            onClick={prevHandler}
          >
            <FontAwesomeIcon icon="chevron-left" />
          </button>

          {lesson.type === "info" ? (
            <Info content={lesson} state={state} focus={lesson.kanji} />
          ) : (
            <Context
              content={lesson}
              state={state}
              focus={lesson.sentence.audio}
            />
          )}

          <button type="button" onClick={nextHandler}>
            <FontAwesomeIcon icon="chevron-right" />
          </button>
        </div>
      </main>
    )
  );
}
