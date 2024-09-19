import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./register.module.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const navigate = useNavigate();

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (isTyping) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        validateInput(username, password, verifyPassword, recaptchaToken);
      }, 1000);
    }
    return () => clearTimeout(typingTimeoutRef.current);
  }, [username, password, verifyPassword, recaptchaToken]);

  const validateInput = async (username, password, verifyPassword, recaptchaToken) => {
    setIsTyping(false);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://seismologos.onrender.com/validate/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const result = await response.json();
      let errorMessages = [];

      if (!response.ok) {
        errorMessages = await result.errors.map(
          (err) => err.msg || "ΣΦΑΛΜΑ: Άγνωστο Σφάλμα"
        );
      }

      if (password !== verifyPassword) {
        errorMessages.push("Οι κωδικοί πρόσβασης δεν ταιριάζουν");
      }

      if (!recaptchaToken) {
        errorMessages.push("Συμπληρώστε το ReCAPTCHA για να συνεχίσετε");
      }

      setErrors(errorMessages);
    } catch (error) {
      setErrors([`ERROR: ${error.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.length > 0 || password !== verifyPassword || !recaptchaToken) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://seismologos.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, recaptchaToken }),
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        let errorMessages = [];

        if (!response.ok) {
          errorMessages = result.errors.map(
            (err) => err.msg || "ΣΦΑΛΜΑ: Άγνωστο Σφάλμα"
          );
        }

        if (password !== verifyPassword) {
          errorMessages.push("Οι κωδικοί πρόσβασης δεν ταιριάζουν");
        }

        setErrors(errorMessages);
      }
    } catch (error) {
      setErrors([`ERROR: ${error.message}`]);
    } finally {
      setIsLoading(false);
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
            onChange={(e) => {
              setUsername(e.target.value);
              setIsTyping(true);
            }}
            className={styles.input}
            disabled={isLoading}
          />
        </div>
        <div>
          <input
            type={showPasswords ? "text" : "password"}
            id="password"
            placeholder="Κωδικός Πρόσβασης"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsTyping(true);
            }}
            className={styles.input}
            disabled={isLoading}
          />
        </div>
        <div>
          <input
            type={showPasswords ? "text" : "password"}
            id="verifyPassword"
            placeholder="Επιβεβαίωση Κωδικού"
            value={verifyPassword}
            onChange={(e) => {
              setVerifyPassword(e.target.value);
              setIsTyping(true);
            }}
            className={styles.input}
            disabled={isLoading}
          />
        </div>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="showPasswords"
            checked={showPasswords}
            onChange={() => setShowPasswords(!showPasswords)}
            className={styles.checkbox}
            disabled={isLoading}
          />
          <label className={styles.showPasswords} htmlFor="showPasswords">
            Εμφάνιση Κωδικών
          </label>
        </div>
        <br/>
        <div className={styles.recaptchaContainer}>
          <ReCAPTCHA
            sitekey="6LewXkkqAAAAAGJ6SDrae3QLTqBF4wJ6eKO-Z3qD"
            onChange={(token) => setRecaptchaToken(token)}
            onExpired={() => setRecaptchaToken(null)}
          />
        </div>
        <br />
        <button type="submit" className={styles.button} disabled={isLoading}>
          Εγγραφή
        </button>
      </form>
      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.map((error, index) => (
            <p key={index} className={styles.error}>
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Register;