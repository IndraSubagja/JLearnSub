import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import styles from "../../styles/Vocabs/Review.module.css";
import { Context, Info } from "./_components";
import data from "../../data.json";
import {
  getAudio,
  getAudioSrc,
  getMeaning,
  getReading,
} from "../../utils/vocab";
import shuffle from "../../utils/shuffle";

const Vocabs = data.data;

export default function Review({ changeMode, indices, setIndices, isQuiz }) {
  const [reviews, setReviews] = useState(null);
  const [state, setState] = useState({
    show: null,
    result: null,
    answer: null,
  });

  const review = reviews && reviews[0];

  const backHandler = useCallback(() => {
    changeMode("menu");
    setIndices([]);
    localStorage.removeItem("reviews");
    localStorage.removeItem("totalReviews");
    localStorage.removeItem("reviewsState");
  }, [changeMode, setIndices]);

  const quizHandler = useCallback(
    (options, answer) => {
      const checkAnswer = (options, answer) => {
        const correctAnswers = [];
        options
          ?.join(", ")
          .split(", ")
          .map((option) => {
            const answer = option.toLowerCase();
            correctAnswers.push(answer.trim());
            if (answer.includes("(")) {
              correctAnswers.push(answer.replace(/\(.*\)/, "").trim());
              correctAnswers.push(answer.replace(/[()]/g, "").trim());
            }
          });

        return correctAnswers.includes(answer.toLowerCase())
          ? "correct"
          : "wrong";
      };

      if (state.show) {
        const newState = { show: false, result: "", answer: null };

        setReviews((reviews) => [...reviews.slice(1)]);
        localStorage.setItem("reviews", JSON.stringify([...reviews.slice(1)]));
        setState(newState);
        localStorage.setItem("reviewsState", JSON.stringify(newState));
      } else {
        const newState = {
          show: true,
          result: review.type === "info" ? checkAnswer(options, answer) : "",
          answer,
        };
        setState(newState);
        localStorage.setItem("reviewsState", JSON.stringify(newState));
      }
    },
    [review?.type, reviews, state.show]
  );

  const undoHandler = useCallback(() => {
    const newState = { show: false, result: "", answer: null };
    setState(newState);
    localStorage.setItem("reviewsState", JSON.stringify(newState));
  }, []);

  useEffect(() => {
    const generateQuizFromReview = (review) => {
      const quiz = [
        {
          ...review,
          type: "info",
          title: "Vocab Writing",
          withAuto: true,
          focus: review.kanji,
          subFocus: review.meaning.join(", "),
          options: [review.kana, review.kanji].filter((option) => option),
        },
      ];

      if (isQuiz) {
        quiz.push(
          {
            ...review,
            type: "info",
            title: "Vocab Meaning",
            focus: review.audio,
            options: review.meaning,
          },
          {
            ...review,
            type: "info",
            title: "Vocab Writing",
            kanaType: true,
            focus: review.meaning[0],
            options: [review.kana, review.kanji].filter((option) => option),
          },
          {
            ...review,
            type: "context",
            title: "Vocab Reading",
            withAuto: true,
            focus: review.sentence.context,
          }
        );

        !review.isKana &&
          quiz.push({
            ...review,
            type: "info",
            title: "Vocab Writing",
            kanaType: true,
            focus: review.kanji,
            options: [review.kana, review.kanji].filter((option) => option),
          });
      }

      return quiz;
    };

    const convertIndicesToReviews = (indices) => {
      const reviews = [];

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
        const hint = {
          audio: vocab["Subtitle Audio"],
          text: vocab["Subtitle Recall"] || vocab["Subtitle"],
        };
        const isKatakana = vocab["Katakana?"] === "y";
        const isKana = vocab["Kana?"] === "y" || vocab["Katakana?"] === "y";

        const review = {
          index,
          kanji,
          meaning,
          subtitle,
          notes,
          audio,
          reading,
          kana,
          sentence,
          hint,
          isKatakana,
          isKana,
        };
        reviews.push(...generateQuizFromReview(review));
      });

      localStorage.setItem("totalReviews", reviews.length);
      return shuffle(reviews);
    };

    if (!reviews) {
      const localReviews = JSON.parse(localStorage.getItem("reviews"));
      const reviews = localReviews || convertIndicesToReviews(indices);
      setReviews(reviews);
      localStorage.setItem("reviews", JSON.stringify(reviews));
    } else if (!reviews.length) {
      backHandler();
    }
  }, [reviews, indices, backHandler, isQuiz]);

  useEffect(() => {
    const localState = JSON.parse(localStorage.getItem("reviewsState"));
    setState(localState || { show: false, result: "", answer: null });
  }, []);

  return (
    review && (
      <main className={styles.review}>
        <div>
          <button type="button" onClick={backHandler}>
            <span>
              <FontAwesomeIcon icon="chevron-left" />
            </span>
            <span>Back to Menu</span>
          </button>

          <h4>
            {reviews.length} /{" "}
            {localStorage.getItem("totalReviews", reviews.length)}
          </h4>
        </div>

        <div>
          {review.type === "info" ? (
            <Info
              content={review}
              state={state}
              quizHandler={quizHandler}
              undoHandler={undoHandler}
            />
          ) : (
            <Context
              content={review}
              state={state}
              quizHandler={quizHandler}
              undoHandler={undoHandler}
            />
          )}
        </div>
      </main>
    )
  );
}
