import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router";
import cookie from "react-cookies";

const AuthContext = React.createContext();

const url = "http://localhost:3000/api";

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    return fetch(`${url}/login`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "csrf-token": `${cookie.load("csrf-token")}`,
      }),
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      credentials: "include",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          return { message: res.message };
        } else if (res.token) {
          setCurrentUser(res.token);
          return { token: res.token };
        } else {
          return { error: "An error occured" };
        }
      })
      .catch((error) => {
        return error.message;
      });
  }

  function forgotPassword(email) {
    return fetch(`${url}/forgot-password`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "csrf-token": `${cookie.load("csrf-token")}`,
      },
      body: JSON.stringify({
        email: email,
      }),
      credentials: "include",
      mode: "cors",
    });
  }

  function register(username, email, password) {
    return fetch(`${url}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": `${cookie.load("csrf-token")}`,
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
      credentials: "include",
      mode: "cors",
    });
  }

  function signout() {
    localStorage.clear();
    setCurrentUser(null);
  }

  function isLoggedIn(localToken) {
    if (localStorage.token) {
      return fetch(`${url}/isLoggedIn`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          "csrf-token": `${cookie.load("csrf-token")}`,
        }),
        body: JSON.stringify({
          token: localToken,
        }),
        credentials: "include",
        mode: "cors",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.token === localToken) {
            localStorage.setItem("token", res.token);
            setCurrentUser(res.token);
            setLoading(false);
          } else {
            localStorage.clear();
            setCurrentUser(null);
            Redirect("/login");
            setLoading(false);
          }
        });
    } else {
      localStorage.clear();
      setCurrentUser(null);
      Redirect("/login");
      setLoading(false);
    }
  }

  function updateProfilePicture(profilePicture) {
    return fetch(`${url}/update-profilepicture`, {
      method: "POST",
      headers: new Headers({
        "csrf-token": `${cookie.load("csrf-token")}`,
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
      body: profilePicture,
      credentials: "include",
      mode: "cors",
    });
  }

  function updateUsername(username) {
    return fetch(`${url}/change-username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": `${cookie.load("csrf-token")}`,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        username: username,
      }),
      credentials: "include",
      mode: "cors",
    });
  }

  function updateEmail(email) {
    return fetch(`${url}/change-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": `${cookie.load("csrf-token")}`,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        email: email,
      }),
      credentials: "include",
      mode: "cors",
    });
  }

  function updatePassword(password) {
    return fetch(`${url}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": `${cookie.load("csrf-token")}`,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        password: password,
      }),
      credentials: "include",
      mode: "cors",
    });
  }

  function profile() {
    return fetch(`${url}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": `${cookie.load("csrf-token")}`,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      credentials: "include",
      mode: "cors",
    });
  }

  useEffect(() => {
    isLoggedIn(localStorage.token);
  }, []);

  const value = {
    login,
    register,
    signout,
    updateUsername,
    updateEmail,
    updatePassword,
    forgotPassword,
    currentUser,
    updateProfilePicture,
    profile,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
