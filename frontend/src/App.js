import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ForgetPassword from "./components/Forgot-password";
import UpdateProfile from "./components/UpdateProfile";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import { useEffect } from "react";

function App() {
  const url = "http://localhost:3000/api";

  async function getToken() {
    await fetch(`${url}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    });
  }
  useEffect(() => {
    getToken();
  });

  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} />
          <Route path="/register" component={Register} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgetPassword} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
