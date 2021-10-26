import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

function UpdateProfile() {
  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [profilePictureRef, setProfilePicture] = useState();
  const [error, setError] = useState();
  const [style, setStyle] = useState();
  const [loading, setLoading] = useState(false);
  const { updateUsername, updateEmail, updatePassword, updateProfilePicture } =
    useAuth();

  async function handleUsername(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUsername(usernameRef.current.value)
        .then((res) => res.json())
        .then((res) => {
          setError(res.message);
          if (res.message === "Updated Sucessfully") {
            setStyle("success");
          } else {
            setStyle("danger");
          }
        })
        .catch((error) => {
          setError("Something went wrong...");
        });

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  async function handleEmail(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await updateEmail(emailRef.current.value)
        .then((res) => res.json())
        .then((res) => {
          setError(res.message);
          if (res.message === "Updated Sucessfully") {
            setStyle("success");
          } else {
            setStyle("danger");
          }
        })
        .catch((error) => {
          setError("Something went wrong");
        });

      setLoading(false);
    } catch (error) {
      setError("Something went wrong...");
      setLoading(false);
    }
  }

  async function handlePassword(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await updatePassword(passwordRef.current.value)
        .then((res) => res.json())
        .then((res) => {
          setError(res.message);
          if (res.message === "Updated Sucessfully") {
            setStyle("success");
          } else {
            setStyle("danger");
          }
        })
        .catch((error) => {
          setError("Something went wrong");
        });

      setLoading(false);
    } catch (error) {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  const handleUpload = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  async function handleProfilePicture(e) {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("profilePicture", profilePictureRef);

      setLoading(true);
      await updateProfilePicture(data)
        .then((res) => res.json())
        .then((res) => {
          setError(res.message);

          if (res.message === "Updated Sucessfully") {
            setStyle("success");
          } else {
            setStyle("danger");
          }
        })
        .catch((error) => {
          setError("Something went wrong");
        });

      setLoading(false);
    } catch (error) {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="login">
        <div className="login-content">
          <form onSubmit={handleProfilePicture}>
            <h1 className="text-center my-4">Change Details</h1>

            {error ? <div className={`alert alert-${style}`}>{error}</div> : ""}

            <div className="mb-3 d-flex">
              <input
                className="p-2 m-2 form-control form-control fs-15px"
                type="file"
                placeholder="Profile Picture"
                name="profilePicture"
                required
                onChange={handleUpload}
              />
              <button disabled={loading} className="p-2 m-2  btn btn-primary">
                Update
              </button>
            </div>
          </form>
          <form onSubmit={handleUsername}>
            <div className="mb-3 d-flex">
              <input
                className="p-2  m-2  form-control form-control fs-15px"
                type="text"
                placeholder="Username"
                ref={usernameRef}
                required
                minLength="8"
              />
              <button disabled={loading} className="p-2 m-2  btn btn-primary">
                Update
              </button>
            </div>
          </form>
          <form onSubmit={handleEmail}>
            <div className="mb-3 d-flex">
              <input
                className="p-2 m-2   form-control form-control fs-15px"
                type="email"
                placeholder="Email address"
                ref={emailRef}
                required
              />
              <button disabled={loading} className="p-2 m-2  btn btn-primary">
                Update
              </button>
            </div>
          </form>
          <form onSubmit={handlePassword}>
            <div className="mb-3 d-flex">
              <input
                className="p-2  m-2  form-control form-control fs-15px"
                type="password"
                placeholder="Password"
                ref={passwordRef}
                minLength="8"
              />
              <button disabled={loading} className="p-2 m-2  btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateProfile;
