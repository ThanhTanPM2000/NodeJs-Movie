import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Redirect, Switch, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Movies from "./components/movies";
import MovieForm from "./components/movieForm";
import ProtectedRoute from "./components/common/protectedRoute";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import auth from "./services/authService";
import Logout from "./components/logout";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";

import "./App.css";

class App extends Component {
  state = {
    user: "",
  };

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    return (
      // <React.Fragment>
      // </React.Fragment>

      <div className="App">
        <ToastContainer />
        <NavBar user={user} />
        <main className="container">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/login" component={LoginForm} />

            <ProtectedRoute path="/movies/:id" component={MovieForm} />
            <ProtectedRoute path="/movies" component="Movies" data={user} />
            <ProtectedRoute path="/customers" component={Customers} />
            <ProtectedRoute path="/rentals" component={Rentals} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/movies" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
