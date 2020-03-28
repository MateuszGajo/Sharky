import React, { useState } from "react";
import Authentication from "../features/components/Layout/Authentication/Authentication/Authentication";
import { FaGooglePlusG, FaFacebookF } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";
import "./styles/signin.scss";
const SignIn = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({
      email,
      password
    });
  };
  return (
    <Authentication type="signin">
      <>
        <div className="authentication__form__wrapper__icons">
          <div className="authentication__form__wrapper__icons--icon">
            <FaGooglePlusG />
          </div>
          <div className="authentication__form__wrapper__icons--icon">
            <FiGithub />
          </div>
          <div className="authentication__form__wrapper__icons--icon">
            <FaFacebookF />
          </div>
        </div>
        <p className="authentication__form__wrapper--text">
          Lub przy pomocy e-mail
        </p>
        <div className="authentication__form__wrapper__inputs">
          <form
            className="authentication__form__wrapper__inputs__wrapper"
            onSubmit={handleSubmit}
          >
            <div className="input-form">
              <input
                className="input-form--text"
                type="text"
                data-testid="input-email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <h2 className="input-form--placeholder">E-mail</h2>
            </div>

            <div className="input-form">
              <input
                className="input-form--text"
                type="password"
                data-testid="input-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <h2 className="input-form--placeholder">Hasło</h2>
            </div>
            <div className="authentication__form__wrapper__inputs__wrapper__helpers">
              <div className="authentication__form__wrapper__inputs__wrapper__helpers--remberme">
                <div className="checkbox--icon">
                  <input
                    className="checkbox--icon--input"
                    type="checkbox"
                    value="None"
                    id="remeberme"
                    name="check"
                  />
                  <label
                    className="checkbox--icon--label"
                    htmlFor="remeberme"
                  ></label>
                </div>

                <span className="checkbox--text">Zapamiętaj mnie</span>
              </div>

              <span className="authentication__form__wrapper__inputs__wrapper__helpers--remberme--text">
                Przypomnij hasło
              </span>
            </div>
            <button className="button--auth" data-testid="button-auth">
              Zaloguj
            </button>
          </form>
        </div>
      </>
    </Authentication>
  );
};

export default SignIn;
