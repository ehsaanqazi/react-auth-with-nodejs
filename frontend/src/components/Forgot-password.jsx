import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ForgetPassword() {
  const emailRef = useRef();

  const [error, setError] = useState();

  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState();
  const { forgotPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await forgotPassword(emailRef.current.value)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setError(res.message);
          if (res.message === "Check your email for password link..") {
            setStyle("success");
          } else {
            setStyle("danger");
          }
        });
    } catch (err) {
      setError("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <>
      {" "}
      <div className="login">
        <div className="login-content">
          <form onSubmit={handleSubmit}>
            <h1 className="text-center my-4">Enter your email</h1>
            <div>
              {error ? (
                <div className={`alert alert-${style}`}>{error}</div>
              ) : (
                ""
              )}

              <div className="mb-3">
                <input
                  className="form-control form-control-lg fs-15px"
                  type="email"
                  placeholder="Email address"
                  ref={emailRef}
                  required
                />
              </div>

              <div className="md-3">
                <button
                  disabled={loading}
                  className="btn btn-primary btn-lg d-block w-100 fw-500 mb-3"
                >
                  Reset
                </button>
              </div>
              <div className="mb-3">
                <span className="text-center">Let's Login </span>
                <Link to="/login" className="text-center text-muted">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgetPassword;
