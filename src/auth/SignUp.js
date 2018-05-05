/*
 *   Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 *  Licensed under the Apache License, Version 2.0 (the "License").
 *  You may not use this file except in compliance with the License.
 *  A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the "license" file accompanying this file. This file is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *  express or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 */
import React from "react";
import DynamicImage from "../components/DynamicImage";
import { withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import "../css/app.css";

/**
 * Registration Page
 */
class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      phone: ""
    };
  }

  onEmailChanged(e) {
    this.setState({ email: e.target.value.toLowerCase() });
  }

  onPasswordChanged(e) {
    this.setState({ password: e.target.value });
  }

  onPhoneChanged(e) {
    this.setState({ phone: e.target.value });
  }

  onConfirmationChanged(e) {
    this.setState({ confirm: e.target.value });
  }

  async onSubmitForm(e) {
    e.preventDefault();
    try {
      const params = {
        username: this.state.email.replace(/[@.]/g, "|"),
        password: this.state.password,
        attributes: {
          email: this.state.email,
          phone_number: this.state.phone
        },
        validationData: []
      };
      const data = await Auth.signUp(params);
      await Auth.confirmSignUp(this.state.email.replace(/[@.]/g, "|"))
        .then(data => console.log(data))
        .catch(err => console.log(`Wtf: ${err}`));
      console.log(data);
      this.props.history.replace("/signin");
    } catch (err) {
      alert(err.message);
      console.error("Exception from Auth.signUp: ", err);
      this.setState({ email: "", password: "", confirm: "" });
    }
  }

  isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  render() {
    const isValidEmail = this.isValidEmail(this.state.email);
    const isValidPassword = this.state.password.length > 6;
    const isValidConfirmation =
      isValidPassword && this.state.password === this.state.confirm;

    return (
      <div className="app">
        <header>
          <DynamicImage src="logo.png" />
        </header>
        <section className="form-wrap">
          <h1>Register</h1>
          <form id="registrationForm" onSubmit={e => this.onSubmitForm(e)}>
            <input
              className={isValidEmail ? "valid" : "invalid"}
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={e => this.onEmailChanged(e)}
            />
            <input
              className="valid"
              type="phone"
              placeholder="Phone"
              value={this.state.phone}
              onChange={e => this.onPhoneChanged(e)}
            />
            <input
              className={isValidPassword ? "valid" : "invalid"}
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={e => this.onPasswordChanged(e)}
            />
            <input
              className={isValidConfirmation ? "valid" : "invalid"}
              type="password"
              placeholder="Confirm Password"
              value={this.state.confirm}
              onChange={e => this.onConfirmationChanged(e)}
            />
            <input
              disabled={
                !(isValidEmail && isValidPassword && isValidConfirmation)
              }
              type="submit"
              value="Let's Ryde"
            />
          </form>
        </section>
      </div>
    );
  }
}

export default withRouter(SignUp);
