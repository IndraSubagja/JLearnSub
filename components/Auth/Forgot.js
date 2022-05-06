export default function Forgot({ setMode }) {
  return (
    <form>
      <h1>Forgot Password</h1>

      <div>
        <div className="input-control">
          <label htmlFor="email">Email Address</label>
          <input type="email" name="email" id="email" placeholder="Enter your email address" />
        </div>
      </div>

      <button type="submit" className="btn btn-block btn-submit">
        Submit
      </button>

      <p>
        <button type="button" className="btn-inline" onClick={() => setMode('login')}>
          Back to login page
        </button>
      </p>
    </form>
  );
}
