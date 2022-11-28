import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./Enter.css";
import { Link, useNavigate } from "react-router-dom";
function Enter() {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  async function handleClick(event) {
    event.preventDefault();

    const email = event.target[0].value;
    const password = event.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      setError(true);
    }
  }

  return (
    <div className="enter">
      <div className="enterContainer">
        <div className="enterOne">
          <h1 className="enterTitle">Welcome to Sleek</h1>
        </div>
        <div className="enterTwo">
          <div className="enterUserInput">
            <div className="enterBot">
              <form onSubmit={handleClick} className="enterUserBot">
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="enterInput"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="enterInput"
                  minLength={5}
                  required
                />
                <Link to="/home">
                  <button type="submit" className="enterBtn">
                    Sign In
                  </button>
                </Link>
                <Link to="/">
                  <button className="enterLogBtn">Create a New Account</button>
                </Link>
                {error && <span>Error</span>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Enter;
