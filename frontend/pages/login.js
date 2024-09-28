import React, { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = formData;

    // Check if all fields are filled
    if (!username || !password) {
      alert('Please fill in all fields.');
      return;
    }

    // Handle form submission logic
    alert('Form submitted successfully!');
  };

  return (
    <div className="container">
      <div className="back-link">
        <a href="/">Back to home</a>
      </div>
      <h1>Log in to get started</h1>
      <form onSubmit={handleSubmit}>
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
        <div className="button-container">
          <button type="submit">Log In</button>
        </div>
      </form>
      <p style={{ color: 'black' }}>Don't have an account? <a href="/sign_up">Sign up</a></p>
    </div>
  );
}