import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [extendedDiv, setExtendedDiv]=useState('')
  const { closeModal } = useModal();


  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(() => {
          closeModal();
          history.push('/groups')
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(Object.values(data.errors));
          else setErrors([data.message]);
          if(data.length>0)setExtendedDiv('extended')
        });
    }
    return setErrors([
      "Confirm Password field must be the same as the Password field",
    ]);
  };

  return (
    <div className={`signup-outer-div ${extendedDiv}`}>
      <div className="login-header">
        <img
          className="linkup-logo"
          src="https://see.fontimg.com/api/renderfont4/rg9Rx/eyJyIjoiZnMiLCJoIjo2OCwidyI6MjAwMCwiZnMiOjM0LCJmZ2MiOiIjRjY1OTU5IiwiYmdjIjoiI0ZGRkZGRiIsInQiOjF9/TFU/ananda-black-personal-use-regular.png"
          alt="logo"
        />
        <h1>Sign Up</h1>
      </div>
      <form className="modal-form" onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div>
          <label className="form-label">Email</label>
          <input
            className="form-inputs"
            type="text"
            value={email}
            placeholder="example@email.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="form-label">Username</label>
          <input
            className="form-inputs"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="form-label">First Name</label>
          <input
            className="form-inputs"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="form-label">Last Name</label>
          <input
            className="form-inputs"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
        </div>
        <div>
          <label className="form-label">Confirm Password</label>
          <input
            className="form-inputs"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button class="form-submit-button" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
