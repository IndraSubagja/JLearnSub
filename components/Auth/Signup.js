import { useContext, useState } from 'react';
import axios from 'axios';
import UserContext from '../../contexts/user';
import GeneralContext from '../../contexts/general';

export default function Signup({ setMode }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setPopup, setLoading } = useContext(GeneralContext);
  const { setUser } = useContext(UserContext);

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('/api/auth/signup', { firstName, lastName, username, email, password });
      setUser(data);
      setPopup({ type: true, message: `Welcome, ${data.firstName}!` });

      event.target.reset();
    } catch (error) {
      setPopup({ type: false, message: error.response?.data?.message || error.message });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={submitHandler}>
      <h1>Create New Account</h1>

      <div>
        <div className="input-flex">
          <div className="input-control">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First name"
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div className="input-control">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last name"
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
        </div>

        <div className="input-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

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
      </div>

      <button type="submit" className="btn btn-block btn-submit">
        Sign Up
      </button>

      <p>
        Already have an account?{' '}
        <button type="button" className="btn-inline" onClick={() => setMode('login')}>
          Login to your account
        </button>
      </p>
    </form>
  );
}
