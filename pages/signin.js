import React, { useState } from "react";
import Authentication from "../features/components/Layout/Authentication/Authentication";
import { FaGooglePlusG, FaFacebookF } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";
import "./styles/signin.scss";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
  };
  return (
    <Authentication>
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
            <div className="authentication__form__wrapper__inputs__wrapper--input">
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <h2 className="authentication__form__wrapper__inputs__wrapper--input--placeholder">
                E-mail
              </h2>
            </div>

            <div className="authentication__form__wrapper__inputs__wrapper--input">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <h2 className="authentication__form__wrapper__inputs__wrapper--input--placeholder">
                Hasło
              </h2>
            </div>
            <div className="authentication__form__wrapper__inputs__wrapper--helpers">
              <div className="authentication__form__wrapper__inputs__wrapper--helpers--remberme">
                <div className="authentication__form__wrapper__inputs__wrapper--helpers--remberme--icon">
                  <input
                    type="checkbox"
                    value="None"
                    id="remeberme"
                    name="check"
                  />
                  <label htmlFor="remeberme"></label>
                </div>

                <span>Zapamiętaj mnie</span>
              </div>

              <span>Przypomnij hasło</span>
            </div>
            <button className="authentication__form__wrapper__inputs--buton">
              Zaloguj
            </button>
          </form>
        </div>
      </>
    </Authentication>
  );
};

export default SignIn;
