import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router";
import cookie from "react-cookies";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const history = useHistory();
  const token = cookie.load("csrf-token");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      let response = await login(
        emailRef.current.value,
        passwordRef.current.value
      );

      if (response.token) {
        localStorage.setItem("token", response.token);
        history.push("/");
      } else if (response.message) {
        setError(response.message);
      } else {
        setError("Something went wrong...");
      }

      setLoading(false);
    } catch {
      setError("Something went wrong...");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="login">
        <div className="login-content">
          <form onSubmit={handleSubmit}>
            <h1 className="text-center my-4">Login</h1>
            <div className="">
              {error ? <div className="alert alert-danger">{error}</div> : ""}
              <input type="hidden" name="_csrf" value={token} />
              <div className="mb-3">
                <input
                  className="form-control form-control-lg fs-15px"
                  type="email"
                  placeholder="Email address"
                  ref={emailRef}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  className="form-control"
                  type="password"
                  placeholder="Password"
                  ref={passwordRef}
                  required
                />
              </div>

              <div className="mb-3">
                <button
                  disabled={loading}
                  className="btn btn-primary btn-lg d-block w-100 fw-500 mb-3"
                >
                  Login
                </button>
              </div>
              <div className="mb-3">
                <span className="text-center">Not have an account? </span>
                <Link to="/register" className="text-center text-muted">
                  {" "}
                  Register Here
                </Link>
              </div>
              <div className="mb-3">
                <Link to="/forgot-password"> Forget Password</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
