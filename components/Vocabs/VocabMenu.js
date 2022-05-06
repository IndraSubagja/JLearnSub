import styles from "../../styles/Home.module.css";

export default function VocabMenu({ changeMode, indices, setIndices }) {
  const convertStringToIndices = (str) => {
    const indices = [];

    str.split(",").map((number) => {
      number = number.trim();
      const numberRegex = /^[0-9]+|[0-9]+-[0-9]+$/;
      if (!numberRegex.test(number) || !parseInt(number)) return;

      const isRangedNumber = number.indexOf("-") > -1;
      if (isRangedNumber) {
        const [from, to] = number.split("-");
        for (let n = from - 1; n < to; n++) {
          const index = parseInt(n);
          indices.indexOf(index) === -1 && indices.push(index);
        }
      } else {
        const index = parseInt(number - 1);
        indices.indexOf(index) === -1 && indices.push(index);
      }
    });

    return indices.sort((a, b) => a - b);
  };

  return (
    <main className={styles.home}>
      <h1 className={styles.title}>Welcome to JLearnSub</h1>

      <div className={styles.menu}>
        <div>
          <label htmlFor="index">Enter Words Index:</label>
          <input
            type="text"
            name="index"
            id="index"
            autoComplete="off"
            onChange={(event) =>
              setIndices(convertStringToIndices(event.target.value))
            }
            placeholder="e.g. 1, 4, 7-10"
          />
        </div>

        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => changeMode("lesson")}
            disabled={!indices.length}
          >
            Lesson
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => changeMode("review")}
            disabled={!indices.length}
          >
            Review
          </button>
        </div>
      </div>
    </main>
  );
}
