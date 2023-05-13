import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
 const dispatch = useDispatch();
 // ...
 const [image, setImage] = useState(null);
 // ...
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [errors, setErrors] = useState([]);
 const { closeModal } = useModal();

 const handleSubmit = (e) => {
  e.preventDefault();
  if (password === confirmPassword) {
   setErrors([]);
   return dispatch(sessionActions.signup({ username, password, image }))
    .then(closeModal)
    .catch(async (res) => {
     const data = await res.json();
     if (data?.errors) setErrors(data.errors);
    });
  }
  return setErrors([
   "Confirm Password field must be the same as the Password field",
  ]);
 };
 // frontend/src/components/SignupFormModal/index.js

 const updateFile = (e) => {
  const file = e.target.files[0];
  if (file) setImage(file);
 };
 return (
  <>
   <h1>Sign Up</h1>
   <form onSubmit={handleSubmit}>
    <ul>
     {errors.map((error, idx) => (
      <li key={idx}>{error}</li>
     ))}
    </ul>
    <label>
     Username
     <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
     />
    </label>
    <label>
     Password
     <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
     />
    </label>
    <label>
     Confirm Password
     <input
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
     />
    </label>
    <label>
     Avatar
     <input type="file" onChange={updateFile} />
    </label>
    <button type="submit">Sign Up</button>
   </form>
  </>
 );
}

export default SignupFormModal;
