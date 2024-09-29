import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function SignUp() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, username, password, confirmPassword } = formData;

    // Check if all fields are filled
    if (!email || !username || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    const response = await axios.post('http://127.0.0.1:5000/signup', {
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    if (response.data.status == 0) {
      sessionStorage.setItem("user_id", response.data.user_id);
      sessionStorage.setItem("username", response.data.username);
      router.push("/home");
    }
    else {
      alert('YOU FUCKING SUCK! (backend couldn"t put u in pal)');
    }

  };

  return (
    <div className="container">
      <div className="back-link">
        <a href="/">Back to home</a>
      </div>
      <h1>Sign up to get started</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="Email"

            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Username
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </label>
        <div className="button-container">
            <button type="submit">Create</button>
        </div>
        
      </form>
      <p style={{color:'black'}}>Already have an account? <a href="/login">Log in</a></p>

    </div>
  );
}