import React, { useState } from 'react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== verifyPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch('https://seismologos.onrender.com/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('User registered successfully!');
            } else {
                let errorMessage = ''; 
                if (result.errors && Array.isArray(result.errors)) {
                    errorMessage = result.errors.map(err => err.msg || 'An unknown error occurred').join('\n');
                } else if(result.error){
                    errorMessage = result.error;
                }
                else {
                    errorMessage = 'An unknown error occurred';
                }
                setMessage(`\n${errorMessage}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type={showPasswords ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="verifyPassword">Verify Password:</label>
                    <input
                        type={showPasswords ? "text" : "password"}
                        id="verifyPassword"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="showPasswords"
                        checked={showPasswords}
                        onChange={() => setShowPasswords(!showPasswords)}
                    />
                    <label htmlFor="showPasswords">Show Passwords</label>
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
