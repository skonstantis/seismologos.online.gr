import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./register.module.css";
import { validateInput } from "../js/register/validateInput";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(false); 

  const navigate = useNavigate();
  const typingTimeoutRef = useRef(null); 

  useEffect(() => {
    if (isTyping && !pendingRequest) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(async () => {
        setPendingRequest(true);
        await validateInput(username, email, password, verifyPassword, recaptchaToken, setIsTyping, setIsLoading, setErrors);
        setPendingRequest(false);
      }, 100);
    }
    return () => clearTimeout(typingTimeoutRef.current);
  }, [username, email, password, verifyPassword, recaptchaToken, isTyping, pendingRequest]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.length === 0 && (password !== verifyPassword || !recaptchaToken)) {
      let errorMessages = [];
      errorMessages.push("Η φόρμα είναι άδεια");
      setErrors(errorMessages);
    }

    if (errors.length > 0 || password !== verifyPassword || !recaptchaToken) {
      return;
    }

    setIsLoading(true);
    setPendingRequest(true);

    try {
      const response = await fetch("https://seismologos.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, recaptchaToken }),
      });

      const result = await response.json();

      if (response.ok) {
        setConfirmationMessage(true); 
        setUsername("");
        setEmail("");
        setPassword("");
        setVerifyPassword("");
        setRecaptchaToken(null);
        setErrors([]); 
      } else {
        let errorMessages = result.errors.map(err => err.msg || "ΣΦΑΛΜΑ: Άγνωστο Σφάλμα");
        if (password !== verifyPassword) {
          errorMessages.push("Οι κωδικοί πρόσβασης δεν ταιριάζουν");
        }
        setErrors(errorMessages);
      }
    } catch (error) {
      setErrors([`ERROR: ${error.message}`]);
    } finally {
      setIsLoading(false);
      setPendingRequest(false); 
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Εγγραφή Χρήστη</h1>
      {confirmationMessage ? (
        <div className={styles.confirmationMessage}>
          <p>Ένας σύνδεσμος επιβεβαίωσης έχει σταλεί στο e-mail σας.</p>
          <p>Θα μπορείτε να αποκτήσετε πρόσβαση στον λογαριασμό σας μόλις επιβεβαιώσετε το e-mail σας.</p>
          <p><strong>Σημαντικό:</strong> Έχετε <strong>7 ημέρες</strong> για να επιβεβαιώσετε το e-mail σας. Μετά από 7 ημέρες, ο λογαριασμός σας θα διαγραφεί αυτόματα και θα πρέπει να δημιουργήσετε νέο.</p>
          <button 
            className={styles.returnButton}
            onClick={() => navigate("/")}
          >
            Επιστροφή στην Αρχική
          </button>
        </div>
      ) : (
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
            />
          </div>        
          <div>
            <input
              type="text"
              id="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsTyping(true);
              }}
              className={styles.input}
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
            <label className={styles.showPasswords} htmlFor="showPasswords">
              Εμφάνιση Κωδικών
            </label>
          </div>
          <br />
          <div className={styles.recaptchaContainer}>
            <ReCAPTCHA
              sitekey="6LeukkkqAAAAAF3cMjAqfU5PcQhLGVm31rVDj3dK"
              onChange={(token) => {
                setRecaptchaToken(token);
                setIsTyping(true);
              }}
              onExpired={() => {
                setRecaptchaToken(null);
                validateInput(username, email, password, verifyPassword, null, setIsTyping, setIsLoading, setErrors);
              }}
            />
          </div>
          <br />
          <button 
            type="submit" 
            className={`${styles.button} ${isLoading ? styles.disabled : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Περιμένετε..." : "Εγγραφή"}
          </button>
          <p className={styles.loginPrompt}>
            Έχετε ήδη λογαριασμό; <a href="/Login" className={styles.loginLink}>Συνδεθείτε</a>
          </p>
        </form>
      )}
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