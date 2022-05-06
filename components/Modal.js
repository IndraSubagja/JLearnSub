import { useContext } from 'react';
import GeneralContext from '../contexts/general';
import styles from '../styles/Modal.module.css';

export default function Modal() {
  const { modal } = useContext(GeneralContext);

  return modal && <div className={styles.modal}>{modal}</div>;
}
