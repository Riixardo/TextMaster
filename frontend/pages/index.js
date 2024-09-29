import React from 'react';
import { useRouter } from 'next/router';


export default function Index() {
    const router = useRouter();

    const handleLoginClick = () => {
      router.push('/login');
    };

    const handleSignupClick = () => {
      router.push('/sign_up');
    };

    return (
        <div style={styles.container}>
            <img src="/textmasterlogo.png" alt="Textmaster Logo" style={styles.logo} className='w-20 h-20'/>
            <div style={styles.content}>
                <button style={styles.loginButton} onClick={handleLoginClick}>Login</button>
                <div style={styles.border}></div>
                <p style={styles.text1}>Accelerate your learning with Textmaster</p>
                <p style={styles.text2}>Learn languages faster, score higher, and compete with friends globally</p>
                <div style={styles.buttonContainer}>
                    {/* <button style={styles.signUpButton}>See Features</button> */}
                    <button style={styles.signUpButton} onClick={handleSignupClick}>Sign Up</button>
                </div>
            </div>
        </div>
    );
}

const styles = {
  container: {
    position: 'relative',
    height: '100vh', // Full viewport height
    width: '100vw',  // Full viewport width
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
      position: 'absolute',
      top: '10px',
      left: '10px',
  },
  content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '50px', // Adjust as needed to avoid overlap with the logo
  },
  loginButton: {
      position: 'absolute',
      top: '10px',
      right: '30px',
      padding: '5px 10px', // Reduced padding
      width: '70px', // Fixed width to 1/4 size
      backgroundColor: '#4F46E5', // Textmaster purple
      color: 'white',
      border: 'none',
      borderRadius: '15px',
      cursor: 'pointer',
  },
  border: {
    position: 'absolute',
    top: '75px', // Adjust this value to position the border below the button
    right: '30px',
    width: '95vw', // Match the width of the button
    height: '2px', // Height of the border
    backgroundColor: 'black', // Color of the border
  },
  text1: {
    position: 'absolute',
    top: '60px', // Adjust this value to position the text below the border
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#4F46E5', // Textmaster purple
    fontSize: '32px', // Adjust font size as needed
    fontWeight: 'bold', // Make the font bold
  },
  text2: {
      position: 'absolute',
      top: '120px',
      left: '50%',
      transform: 'translateX(-50%)',
      color: '#A3A3A3', // Textmaster purple
      fontSize: '16px', // Adjust font size as needed
      fontWeight: 'bold', // Make the font bold
  },
  buttonContainer: {
    position: 'absolute',
    top: '200px', // Adjust this value to position the buttons below the text
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '10px', // Space between the buttons
  },
  signUpButton: {
      padding: '5px 10px', // Reduced padding
      width: '70px', // Fixed width to 1/4 size
      backgroundColor: '#4F46E5', // Textmaster purple
      color: 'white',
      border: 'none',
      borderRadius: '15px',
      cursor: 'pointer',
  },
};