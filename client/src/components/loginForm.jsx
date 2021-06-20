import React from "react";
import Joi from "joi";
import { Redirect } from "react-router-dom";

import Form from "./common/form";
import auth from "../services/authService";

class LoginForm extends Form {
  state = {
    data: {
      username: "",
      password: "",
    },
    errors: {},
  };

  schema = Joi.object({
    username: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Username"),
    password: Joi.string().min(5).required().label("Password"),
  });

  doSubmit = async () => {
    try {
      const { username, password } = this.state.data;
      await auth.login(username, password);

      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (error) {
      const errors = { ...this.state.errors };
      errors.username = error.response.data;
      this.setState({ errors });
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderSubmit("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
