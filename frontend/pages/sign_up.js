import React, { useState } from 'react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, email, username, password, confirmPassword } = formData;

    // Check if all fields are filled
    if (!fullName || !email || !username || !password || !confirmPassword) {
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

    // Handle form submission logic
    alert('Form submitted successfully!');


  };

  return (
    <div className="container">
      <div className="back-link">
        <a href="/">Back to home</a>
      </div>
      <h1>Sign up to get started</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            type="text"
            name="fullName"
            placeholder="Name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </label>
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