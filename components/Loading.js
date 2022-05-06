import { useContext } from "react";
import GeneralContext from "../contexts/general";
import styles from "../styles/Loading.module.css";

export function FullLoading() {
  const { loading } = useContext(GeneralContext);

  return (
    loading && (
      <div className={styles.fullLoading}>
        <img src="/loading.svg" alt="Loading...." />
      </div>
    )
  );
}

export function InlineLoading({ title }) {
  return (
    <div className={styles.inlineLoading}>
      <img src="/loading.svg" alt="Loading...." />
      {title && <h4>{title}</h4>}
    </div>
  );
}
