import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import styles from "./login.module.css";
import Errors from "./Errors";
import { useNavigate } from "react-router-dom";

const Login = () => {
  useEffect(() => {
    document.title = "Σύνδεση Χρήστη";
  }, []);

  const navigate = useNavigate();
  const [key, setkey] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://seismologos.onrender.com/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key, password }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setkey("");
        setPassword("");
        setErrors([]);
        setCurrentErrorIndex(0);
        localStorage.setItem("authToken", result.token); 
        navigate("/");
      } else {
        let errorMessages = result.errors.map(
          (err) => err.msg || "ΣΦΑΛΜΑ: Άγνωστο Σφάλμα"
        );
        setErrors(errorMessages);
        setCurrentErrorIndex(0);
      }
    } catch (error) {
      setErrors([`ERROR: ${error.message}`]);
      setCurrentErrorIndex(0);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Σύνδεση Χρήστη</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <input
              type="text"
              id="key"
              placeholder="Όνομα Χρήστη ή e-mail"
              value={key}
              onChange={(e) => {
                setkey(e.target.value);
              }}
              className={styles.input}
            />
          </div>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Κωδικός Πρόσβασης"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className={styles.input}
            />
          </div>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="showPasswords"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className={styles.checkbox}
            />
            <label className={styles.showPasswords} htmlFor="showPasswords">
              Εμφάνιση Κωδικών
            </label>
          </div>
          <div>
            <br />
          </div>
          <button
            type="submit"
            className={`${styles.button} ${
              isLoading && errors.length !== 0 ? styles.disabled : ""
            }`}
            disabled={isLoading}
          >
            {isLoading && errors.length !== 0 ? "Περιμένετε..." : "Σύνδεση"}
          </button>
          <p className={styles.registerPrompt}>
            Δεν έχετε λογαριασμό;{" "}
            <a href="/register" className={styles.link}>
              <b>Εγγραφείτε</b>
            </a>
          </p>
        </form>
        <Errors
          errors={errors}
          currentErrorIndex={currentErrorIndex}
          setCurrentErrorIndex={setCurrentErrorIndex}
        />
      </div>
    </div>
  );
};

export default Login;
