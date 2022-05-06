import { useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../styles/Popup.module.css';
import GeneralContext from '../contexts/general';

export default function Popup() {
  const { popup, setPopup } = useContext(GeneralContext);

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => {
        setPopup(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [popup, setPopup]);

  return (
    popup && (
      <div className={styles.popup}>
        <span className={popup.type ? 'success' : 'danger'}>
          <FontAwesomeIcon icon={popup.type ? 'check' : 'times'} />
        </span>
        <p>{popup.message}</p>
        <button type="button" onClick={() => setPopup(null)}>
          <FontAwesomeIcon icon="times" />
        </button>
      </div>
    )
  );
}
