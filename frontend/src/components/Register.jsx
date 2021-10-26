import React from "react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState();
  const [style, setStyle] = useState();
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value === passwordConfirmRef.current.value) {
      try {
        setLoading(true);
        await register(
          usernameRef.current.value,
          emailRef.current.value,
          passwordRef.current.value
        )
          .then((res) => res.json())
          .then((res) => {
            setError(res.message);
            if (res.message === "Registered Sucessfully") {
              setStyle("success");
            } else {
              setStyle("danger");
            }
          });
        setLoading(false);
      } catch {
        setStyle("danger");
        setError("Something went wrong...");
        setLoading(false);
      }
    } else {
      setStyle("danger");
      setError("Password's don't match");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="login">
        <div className="login-content">
          <form onSubmit={handleSubmit}>
            <h1 className="text-center my-4">Register</h1>
            <div className="justify-content-center">
              {error ? (
                <div className={`alert alert-${style}`}>{error}</div>
              ) : (
                ""
              )}
              <div className="mb-3">
                <input
                  className="form-control form-control-lg fs-15px"
                  type="text"
                  placeholder="Username"
                  ref={usernameRef}
                  required
                  minLength="8"
                />
              </div>
              <div className="mb-3">
                <input
                  className="form-control form-control-lg fs-15px"
                  type="text"
                  placeholder="Email address"
                  ref={emailRef}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  className="form-control form-control-lg fs-15px"
                  type="password"
                  placeholder="Password"
                  ref={passwordRef}
                  required
                  minLength="8"
                />
              </div>
              <div className="mb-3">
                <input
                  className="form-control form-control-lg fs-15px"
                  type="password"
                  placeholder="Confirm password"
                  ref={passwordConfirmRef}
                  required
                  minLength="8"
                />
              </div>
              <div className="mb-3">
                <button
                  disabled={loading}
                  className="btn btn-primary btn-lg d-block w-100 fw-500 mb-3"
                >
                  Register
                </button>
              </div>
            </div>
          </form>
          <span>Already have an account? </span>
          <Link to="/login"> Login</Link>
        </div>
      </div>
    </>
  );
}

export default Register;
