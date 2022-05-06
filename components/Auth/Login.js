import axios from 'axios';
import { useContext, useState } from 'react';
import GeneralContext from '../../contexts/general';
import UserContext from '../../contexts/user';

export default function Login({ setMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setPopup, setLoading } = useContext(GeneralContext);
  const { setUser } = useContext(UserContext);

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('/api/auth/login', { email, password });

      setUser(data);
      setPopup({ type: true, message: `Welcome back, ${data.firstName}!` });
    } catch (error) {
      setPopup({ type: false, message: error.response?.data?.message || error.message });
    }

    setLoading(false);
    event.target.reset();
  };

  return (
    <form onSubmit={submitHandler}>
      <h1>Login to Your Account</h1>
      <div>
        <div className="input-control">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email address"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="input-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="button" className="btn btn-inline btn-inline-right" onClick={() => setMode('forgot')}>
          Forgot password?
        </button>
      </div>

      <button type="submit" className="btn btn-block btn-submit">
        Log In
      </button>

      <p>
        Don&apos;t have an account?{' '}
        <button type="button" className="btn-inline" onClick={() => setMode('signup')}>
          Create new account
        </button>
      </p>
    </form>
  );
}
