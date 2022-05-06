import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../styles/Error.module.css';

export default function Error({ message }) {
  return (
    <div className={styles.error}>
      <div>
        <FontAwesomeIcon icon="sad-tear" />
        <h4>{message}</h4>
      </div>
    </div>
  );
}
