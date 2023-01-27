// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";

import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(Object.values(data.errors));

        } else {
        setErrors([data.message])
      }
      });
    };

  const demoUserClicked = (e) => {
    e.preventDefault();

    return dispatch(sessionActions.login({ credential:'demo@user.io', password:'password' })).then(
      () => {
        closeModal();
        history.push('/groups')
      }
    );
  }

  return (
    <div className="login-outer-div">
      <div className="login-header">
        <img
          className="linkup-logo"
          src="https://see.fontimg.com/api/renderfont4/rg9Rx/eyJyIjoiZnMiLCJoIjo2OCwidyI6MjAwMCwiZnMiOjM0LCJmZ2MiOiIjRjY1OTU5IiwiYmdjIjoiI0ZGRkZGRiIsInQiOjF9/TFU/ananda-black-personal-use-regular.png"
          alt="logo"
        />
        <h1>Log In</h1>
        {/* Add this Feature later */}
        {/* <p style={{ margin: 0 }}>Not a member yet? Sign up</p> */}
      </div>
      <form className="modal-form" onSubmit={handleSubmit}>
        <div>
          <ul>
            {errors.map((error, idx) => (
              <li className='form-errors' key={idx}>{error}</li>
            ))}
          </ul>
        </div>
        <div>
          <label className="form-label">Username or Email</label>
          <input
            className="form-inputs"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="form-label">Password</label>
          <input
            className="form-inputs"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div>
            <button class="form-submit-button" type="submit">
              Log In
            </button>
          </div>
          <div>
            <button
              class="form-submit-button"
              onClick={demoUserClicked}
              type="submit"
            >
              Demo User
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
