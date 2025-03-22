import React, { useState, useEffect } from "react";
import { logIn, signUp } from "../authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/MainPage");
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    try {
      const user = await action(
        credentials.email,
        credentials.password,
        credentials.name,
        credentials.role
      );
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/MainPage");
    } catch (error) {
      alert(`Error: ${error.message}`); // Show alert if login/signup fails
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="login">
      <center>
        <div className="backgrounding">
      <div><h1>Xamlex</h1></div>
      <h2>Login / Sign Up</h2>
      <form>
        <div className="form-container"> 
          <div>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={credentials.name}
          onChange={handleChange}
          required
        /></div>
        <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
        /></div>
        <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        </div>
        <div>
        <select name="role" value={credentials.role} onChange={handleChange} required>
          <option value="Student">Student</option>
          <option value="Instructor">Instructor</option>
        </select>
</div>
<div className="button-container">
        <button type="button" onClick={(e) => handleSubmit(e, logIn)}><span>Login</span></button>
        <button type="button" onClick={(e) => handleSubmit(e, signUp)}><span>Sign Up</span></button></div>
        </div>
      </form>
      </div>
      </center>
    </div>
  );
};

export default Login;
