import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [errors, setErrors] = useState([]);
    const [passwordMatch, setPasswordMatch] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const validateInput = async () => {
            try {
                const response = await fetch('https://seismologos.onrender.com/validate/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();

                if(!response.ok){
                    let errorMessages = [];
                    if (result.errors && Array.isArray(result.errors)) {
                        errorMessages = result.errors.map(err => err.msg || 'ΣΦΑΛΜΑ: Άγνωστο Σφάλμα');
                    } else {
                        errorMessages.push('ΣΦΑΛΜΑ: Άγνωστο Σφάλμα');
                    }
                    if (password !== verifyPassword) {
                        errorMessages.push('Οι κωδικοί πρόσβασης δεν ταιριάζουν');
                    }
                    setErrors(errorMessages);
                }
                else
                {
                    setErrors([]);
                    setPasswordMatch(false);
                }

                if (password === verifyPassword)
                {
                    setPasswordMatch(false);
                }
                else if(!passwordMatch)
                {
                    setErrors([...errors, 'Οι κωδικοί πρόσβασης δεν ταιριάζουν']);
                    setPasswordMatch(true);
                }
            } catch (error) {
                setErrors([`ERROR: ${error.message}`]);
            }
        };
        validateInput();
    }, [username, password, verifyPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(errors != [] && password !== verifyPassword)
            return;

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
                navigate('/login');
            } else {
                let errorMessages = [];
                if (result.errors && Array.isArray(result.errors)) {
                    errorMessages = result.errors.map(err => err.msg || 'ΣΦΑΛΜΑ: Άγνωστο Σφάλμα');
                } else {
                    errorMessages.push('ΣΦΑΛΜΑ: Άγνωστο Σφάλμα');
                }
                setErrors(errorMessages);
            }
        } catch (error) {
            setErrors([`ERROR: ${error.message}`]);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Εγγραφή Χρήστη</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <input
                        type="text"
                        id="username"
                        placeholder="Όνομα Χρήστη"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.input}
                    />
                </div>
                <div>
                    <input
                        type={showPasswords ? "text" : "password"}
                        id="password"
                        placeholder="Κωδικός Πρόσβασης"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                    />
                </div>
                <div>
                    <input
                        type={showPasswords ? "text" : "password"}
                        id="verifyPassword"
                        placeholder="Επιβεβαίωση Κωδικού"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        className={styles.input}
                    />
                </div>
                <div className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        id="showPasswords"
                        checked={showPasswords}
                        onChange={() => setShowPasswords(!showPasswords)}
                        className={styles.checkbox}
                    />
                    <label className={styles.showPasswords} htmlFor="showPasswords">Εμφάνιση Κωδικών</label>
                </div>
                <br/>
                <button type="submit" className={styles.button}>Εγγραφή</button>
            </form>
            {errors.length > 0 && (
                <div className={styles.errors}>
                    {errors.map((error, index) => (
                        <p key={index} className={styles.error}>{error}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Register;
