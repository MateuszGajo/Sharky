import React, { useState } from "react";
import Authentication from "../features/components/Layout/Authentication/Authentication";
import { FaGooglePlusG, FaFacebookF } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";
import Checkbox from "../features/common/Checkbox/Checkbox";
import PrimaryButton from "../features/common/PrimaryButton/PrimaryButton";
import InputAuth from "../features/common/InputAuth/InputAuth";
import "./styles/main.scss";

const SignIn = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRembermeChecked, setStatusOfRemberme] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      email,
      password,
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
            <InputAuth value={email} onChange={setEmail} title="E-mail" />
            <InputAuth
              type="password"
              value={password}
              onChange={setPassword}
              title="Hasło"
            />

            <div className="authentication__form__wrapper__inputs__wrapper__helpers">
              <div className="authentication__form__wrapper__inputs__wrapper__helpers--remberme">
                <Checkbox
                  value={isRembermeChecked}
                  onChange={setStatusOfRemberme}
                />
              </div>

              <span className="authentication__form__wrapper__inputs__wrapper__helpers--remberme--text">
                Przypomnij hasło
              </span>
            </div>
            <PrimaryButton value="Zaloguj" />
          </form>
        </div>
      </>
    </Authentication>
  );
};

export default SignIn;
