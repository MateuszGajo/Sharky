import React from "react";
// import "./App.css";
function App({ onSubmit }) {
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          const { username, password, phone } = e.target.elements;
          console.log(phone.value);
          // console.log(e.target.elements);
          onSubmit({
            username: username.value,
            password: password.value,
            phonenumber: phone.value
          });
        }}
      >
        <label style={{ justifySelf: "right" }} htmlFor="username-input">
          Username
        </label>
        <input
          id="username-input"
          placeholder="Username..."
          name="username"
          style={{ flex: 1 }}
        />
        <label style={{ justifySelf: "right" }} id="password-input">
          Password
        </label>
        <input
          placeholder="Password..."
          type="password"
          name="password"
          aria-labelledby="password-input"
        />

        <label style={{ justifySelf: "right" }} id="phone-number-input">
          phoneNumber
        </label>
        <input
          placeholder="phoneNumber"
          type="text"
          name="phone"
          aria-labelledby="phone-number-input"
        />
        <button type="submit">log in</button>
      </form>
    </div>
  );
}

export default App;
