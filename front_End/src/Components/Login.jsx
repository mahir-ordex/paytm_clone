import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth(); 
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const navigate = useNavigate();  // for navigation to home page after successful login

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/signin`, formData, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("loginpage",res.data.success)
        if(res.status===200 && res.data.success === true) {

          login(res.data.user, res.data.token); 
          console.log("inside if");
          navigate("/")
        

        }
      })
      .catch((error) => {
        console.error("Login Error:", error.response?.data || error.message);
      });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <label>User Name:</label>
        <input type="text" name="userName" required onChange={handleInputChange} />
        <br />
        <br />
        <label>Password:</label>
        <input type="password" name="password" required onChange={handleInputChange} />
        <br />
        <input type="submit" value="Submit" />
        <br />
        <Link to="/signup">Create An Account?</Link>
      </form>
    </>
  );
}

export default Login;
