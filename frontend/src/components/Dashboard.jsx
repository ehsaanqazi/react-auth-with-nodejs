import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

function Dashboard() {
  const { signout, profile } = useAuth();
  const [error, setError] = useState();
  const [user, setUser] = useState([]);

  const url = "https://reactauthwithnodejs-api.herokuapp.com";

  async function handleLogout() {
    try {
      await signout();
    } catch {
      setError("Something went wrong...");
    }
  }

  async function getProfile() {
    try {
      await profile()
        .then((res) => res.json())
        .then((res) => setUser(res));
    } catch (error) {}
  }

  useEffect(() => {
    getProfile();
  });
  return (
    <>
      <div className="container mt-4 mb-4 p-3 d-flex justify-content-center">
        <div className="card p-4">
          <h3>Username : {user.username}</h3>
          <h3>Email : {user.email}</h3>
          <div className=" image d-flex flex-column justify-content-center align-items-center">
            {error ? <div className="alert alert-danger">{error}</div> : ""}
            <img
              src={`${url}/uploads/` + user.profilePicture}
              height="100"
              width="100"
              alt="user"
            />

            <div className=" d-flex mt-2">
              <Link to="/update-profile">Edit Profile</Link>
            </div>
            <button onClick={handleLogout} className="btn btn-danger">
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
