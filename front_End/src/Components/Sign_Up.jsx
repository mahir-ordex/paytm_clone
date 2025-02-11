import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; 
import {useAuth} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Sign_Up() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.firstName) {
      setError("First Name is required");
      return false;
    }
    if (!formData.lastName) {
      setError("Last Name is required");
      return false;
    }
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    console.log("Submitting form:", formData);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, formData,{
        withCredentials: true, 
      })
      .then((res) => {
            const {login} = useAuth()
            login(res.data.user,res.data.token)
             navigate("/dashboard")
             
        
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {error && <h1 style={{ color: "red" }}>{error}</h1>}

        <label>
          User Name:
          <input type="text" name="userName" onChange={handleInputChange} />
        </label>
        <br />
        <label>
          First Name:
          <input type="text" name="firstName" onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" name="lastName" onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" onChange={handleInputChange} />
        </label>
        <br />
        <input type="submit" value="Submit" />

        <p>
          <Link to="/login">Already have an account?</Link>
        </p>
      </form>
    </>
  );
}

export default Sign_Up;
