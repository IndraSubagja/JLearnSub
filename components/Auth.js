import { useContext, useState } from 'react';

import UserContext from '../contexts/user';
import GeneralContext from '../contexts/general';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import Forgot from './Auth/Forgot';
import styles from '../styles/Auth.module.css';

export default function Auth() {
  const [mode, setMode] = useState('login');

  const { setLoading, setPopup } = useContext(GeneralContext);
  const { setUser } = useContext(UserContext);

  return (
    <div className={styles.auth}>
      {mode === 'login' ? (
        <Login setMode={setMode} setUser={setUser} setPopup={setPopup} setLoading={setLoading} />
      ) : mode === 'signup' ? (
        <Signup setMode={setMode} setUser={setUser} setPopup={setPopup} setLoading={setLoading} />
      ) : (
        <Forgot setMode={setMode} />
      )}
    </div>
  );
}
