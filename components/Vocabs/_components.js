import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState, useCallback } from "react";
import { toHiragana, toKatakana } from "@koozaki/romaji-conv";
import styles from "../../styles/Vocabs.module.css";
import isValidHttpUrl from "../../utils/isValidHttpUrl";
import parser from "react-html-parser";
import { createFurigana, removeFurigana } from "../../utils/vocab";

function AudioButton({ src, auto }) {
  const [playing, setPlaying] = useState(false);

  const audio = useMemo(() => new Audio(src), [src]);
  const audioHandler = () => {
    playing ? audio.pause() : audio.play().catch(() => setPlaying(false));
  };

  useEffect(() => {
    const stopPlaying = () => setPlaying(false);
    const playing = () => setPlaying(true);
    const reloadAudio = () => audio.load();

    audio.addEventListener("playing", playing);
    audio.addEventListener("ended", stopPlaying);
    window.addEventListener("online", reloadAudio);

    return () => {
      audio.removeEventListener("playing", playing);
      audio.removeEventListener("ended", stopPlaying);
      window.removeEventListener("online", reloadAudio);
    };
  }, [audio]);

  useEffect(() => {
    if (auto) {
      audio.play().catch(() => setPlaying(false));
    }
  }, [auto, audio]);

  return (
    <button type="button" className={styles.audioBtn} onClick={audioHandler}>
      <FontAwesomeIcon icon={playing ? "circle-pause" : "circle-play"} />
    </button>
  );
}

export function Context({ content, state, quizHandler, undoHandler }) {
  useEffect(() => {
    const keyHandler = (event) => {
      const submitButton = document.querySelector(
        `.${styles.quiz} > div > button`
      );

      if (event.key === "Enter" && !submitButton?.disabled) {
        quizHandler();
      } else if (event.key === "Backspace" && state.show) {
        undoHandler();
      }
    };

    document.addEventListener("keyup", keyHandler);
    return () => document.removeEventListener("keyup", keyHandler);
  }, [quizHandler, undoHandler, state.show]);

  return (
    <section key={content.index} className={styles.context}>
      <div className={styles.focus}>
        {isValidHttpUrl(content.focus) ? (
          <AudioButton src={content.focus} auto={true} />
        ) : (
          <h2>
            {content?.title === "Vocab Reading"
              ? removeFurigana(content.focus)
              : content.focus}
          </h2>
        )}
      </div>

      {!!quizHandler && (
        <div className={`${styles.quiz} ${styles.correct}`}>
          <h4>{content.title}</h4>
          <div>
            {state.show && (
              <button type="button" onClick={undoHandler}>
                <FontAwesomeIcon icon="undo" />
              </button>
            )}
            <button type="button" onClick={quizHandler}>
              {state.show ? <FontAwesomeIcon icon="arrow-right" /> : "Show"}
            </button>
          </div>
        </div>
      )}

      {state.show && (
        <div className={styles.details}>
          <div className={styles.audio}>
            <AudioButton src={content.sentence.audio} auto={content.withAuto} />
          </div>

          <div className={styles.sentenceContext}>
            <p>{parser(createFurigana(content.sentence.context))}</p>
          </div>
          <div className={styles.sentenceMeaning}>
            <p>{content.sentence.meaning}</p>
          </div>
          <div className={styles.kana}>
            <p>{content.kana}</p>
          </div>
          <div className={styles.reading}>
            <p>{content.reading}</p>
          </div>
          <div className={styles.meaning}>
            <p>{content.meaning.join(", ")}</p>
          </div>
          <div className={styles.subtitle}>
            <p>{content.subtitle}</p>
          </div>
          <div className={styles.notes}>
            <p>{content.notes}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export function Info({ content, state, quizHandler, undoHandler }) {
  const [answer, setAnswer] = useState("");

  const clickHandler = useCallback(() => {
    quizHandler(
      content.options,
      content.title === "Vocab Writing" ? convertStringToKana(answer) : answer
    );
    setAnswer("");
  }, [
    answer,
    content.options,
    content.title,
    quizHandler,
    convertStringToKana,
  ]);

  const convertStringToKana = useCallback(
    (string) => (content.isKatakana ? toKatakana(string) : toHiragana(string)),
    [content.isKatakana]
  );

  const kanaHandler = (string) => {
    let res = string;

    if (content.title === "Vocab Writing") {
      if (string.slice(-2) === "nn") {
        res = string.slice(0, -1);
      } else if (string.slice(-1) === "n") {
        return res;
      }
      return convertStringToKana(res);
    }
    return res;
  };

  useEffect(() => {
    const keyHandler = (event) => {
      const submitButton = document.querySelector("#quiz + button");

      if (event.key === "Enter" && !submitButton?.disabled) {
        clickHandler();
      } else if (event.key === "Backspace" && state.show) {
        undoHandler();
      }
    };

    document.addEventListener("keyup", keyHandler);
    return () => document.removeEventListener("keyup", keyHandler);
  }, [clickHandler, undoHandler, state.show]);

  return (
    <section key={content.index} className={styles.info}>
      <div className={styles.focus}>
        {isValidHttpUrl(content.focus) ? (
          <>
            {!!content.hint?.audio && (
              <p className={styles.hint}>{content.hint.audio}</p>
            )}
            <AudioButton src={content.focus} auto={true} />
          </>
        ) : (
          <>
            {!!content.hint?.text && (
              <p className={styles.hint}>{content.hint.text}</p>
            )}
            <h2>{content.focus}</h2>
            <p>{content.subFocus}</p>
          </>
        )}
      </div>

      {!!content.options && (
        <div className={`${styles.quiz} ${styles[state.result]}`}>
          <h4>{content.title}</h4>
          <div>
            {state.show && (
              <button type="button" onClick={undoHandler}>
                <FontAwesomeIcon icon="undo" />
              </button>
            )}
            {state.show ? (
              <p>{state.answer}</p>
            ) : (
              <input
                type="text"
                name="quiz"
                id="quiz"
                autoComplete="off"
                autoFocus
                value={answer}
                onChange={(event) => setAnswer(kanaHandler(event.target.value))}
                required
              />
            )}
            <button
              type="button"
              disabled={!answer && !state.show}
              onClick={clickHandler}
            >
              <FontAwesomeIcon icon="arrow-right" />
            </button>
          </div>
        </div>
      )}

      {state.show && (
        <div className={styles.details}>
          <div className={styles.audio}>
            <AudioButton src={content.audio} auto={content.withAuto} />
          </div>

          <div className={styles.kana}>
            <p>{content.kana}</p>
          </div>
          <div className={styles.reading}>
            <p>{content.reading}</p>
          </div>
          <div className={styles.meaning}>
            <p>{content.meaning.join(", ")}</p>
          </div>
          <div className={styles.sentenceContext}>
            <p>{parser(createFurigana(content.sentence.context))}</p>
          </div>
          <div className={styles.sentenceMeaning}>
            <p>{content.sentence.meaning}</p>
          </div>
          <div className={styles.subtitle}>
            <p>{content.subtitle}</p>
          </div>
          <div className={styles.notes}>
            <p>{content.notes}</p>
          </div>
        </div>
      )}
    </section>
  );
}
