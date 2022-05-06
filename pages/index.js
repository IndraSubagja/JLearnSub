import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Lesson from "../components/Vocabs/Lesson";
import Review from "../components/Vocabs/Review";
import VocabMenu from "../components/Vocabs/VocabMenu";

export default function Home() {
  const [indices, setIndices] = useState([]);
  const [mode, setMode] = useState(null);

  const changeMode = useCallback(
    (mode) => {
      setMode(mode);
      localStorage.setItem("mode", mode);
      ["review", "lesson"].includes(mode)
        ? localStorage.setItem("indices", JSON.stringify(indices))
        : localStorage.removeItem("indices");
    },
    [indices]
  );

  useEffect(() => {
    if (!mode) {
      const localMode = localStorage.getItem("mode") || "menu";
      setMode(localMode);
    }
  }, [mode]);

  useEffect(() => {
    if (!indices.length && mode !== "menu") {
      const localIndices = JSON.parse(localStorage.getItem("indices")) || [];
      setIndices(localIndices);
    }
  }, [indices, mode]);

  return (
    <>
      <Head>
        <title>JLearnSub</title>
        <meta name="description" content="Website to learn japanese language" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {mode === "review" || mode === "quiz" ? (
        <Review
          changeMode={changeMode}
          indices={indices}
          setIndices={setIndices}
          isQuiz={mode === "quiz"}
        />
      ) : mode === "lesson" ? (
        <Lesson
          changeMode={changeMode}
          indices={indices}
          setIndices={setIndices}
        />
      ) : (
        <VocabMenu
          changeMode={changeMode}
          indices={indices}
          setIndices={setIndices}
        />
      )}
    </>
  );
}
