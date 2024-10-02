import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./register.module.css";
import Errors from "./Errors";
import { useSession } from "../contexts/SessionContext"; 

const Register = () => {
  useEffect(() => {
    document.title = "Εγγραφή Χρήστη";
  }, []);

  const { sessionValid, setNotification } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionValid) {
      const notificationMessage = <div>Αυτό το σημείο σύνδεσης δεν είναι διαθέσιμο ενώ είστε συνδεδεμένοι<br/>Έγινε ανακατεύθηνση στην Αρχική</div>;
      setNotification(notificationMessage, "red");
      navigate("/"); 
    }
  }, [sessionValid, setNotification, navigate]);

  if (sessionValid) return null; 
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const [confirmationMessage, setConfirmationMessage] = useState(false);

  const validateInput = async () => {
    setIsTyping(false);
    setIsLoading(true);
    
    try {
      const response = await fetch("https://seismologos.onrender.com/validate/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      const result = await response.json();
      let errorMessages = [];
  
      if (!response.ok) {
        errorMessages = result.errors.map(err => err.msg || "ΣΦΑΛΜΑ: Άγνωστο Σφάλμα");
      }
  
      if (password !== verifyPassword) {
        errorMessages.push("Οι κωδικοί πρόσβασης δεν ταιριάζουν");
      }
  
      if (!agree) {
        errorMessages.push("Αποδεχθείτε τους Όρους Χρήσης και την Πολιτική Απορρήτου για να συνεχίσετε");
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

  useEffect(() => {
    if (isTyping && !pendingRequest) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(async () => {
        setPendingRequest(true);
        await validateInput();
        setPendingRequest(false);
      }, 100);
    }
    return () => clearTimeout(typingTimeoutRef.current);
  }, [
    username,
    email,
    password,
    verifyPassword,
    recaptchaToken,
    agree, 
    isTyping,
    pendingRequest,
  ]);  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      errors.length === 0 &&
      (password !== verifyPassword || !recaptchaToken || !agree) 
    ) {
      let errorMessages = ["Η φόρμα είναι άδεια"];
      setErrors(errorMessages);
      setCurrentErrorIndex(0);
    }
  
    if (errors.length > 0 || password !== verifyPassword || !recaptchaToken || !agree) {
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
        setCurrentErrorIndex(0);
        const notificationMessage = <div>Επιτυχής εγγραφή</div>;
        setNotification(notificationMessage, "green");
      } else {
        let errorMessages = result.errors.map(
          (err) => err.msg || "ΣΦΑΛΜΑ: Άγνωστο Σφάλμα"
        );
        if (password !== verifyPassword) {
          errorMessages.push("Οι κωδικοί πρόσβασης δεν ταιριάζουν");
        }
        if (!agree) {
          errorMessages.push("Αποδεχθείτε τους Όρους Χρήσης και την Πολιτική Απορρήτου για να συνεχίσετε");
        }
        setErrors(errorMessages);
        setCurrentErrorIndex(0);
      }
    } catch (error) {
      setErrors([`ERROR: ${error.message}`]);
      setCurrentErrorIndex(0);
    } finally {
      setIsLoading(false);
      setPendingRequest(false);
    }
  };  

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Εγγραφή Χρήστη</h1>
        {confirmationMessage ? (
          <div className={styles.confirmationMessage}>
            <p>Ένας σύνδεσμος επιβεβαίωσης έχει σταλεί στο e-mail σας.</p>
            <p>
              Θα μπορείτε να αποκτήσετε πρόσβαση στον λογαριασμό σας μόλις
              επιβεβαιώσετε το e-mail σας.
            </p>
            <p>
              <strong>Σημαντικό:</strong> Έχετε <strong>7 ημέρες</strong> για να
              επιβεβαιώσετε το e-mail σας. Μετά από 7 ημέρες, ο λογαριασμός σας
              θα διαγραφεί αυτόματα και θα πρέπει να δημιουργήσετε νέο.
            </p>
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
            <div>
              <br />
            </div>
            <span>
              <input
                type="checkbox"
                onChange={() => {
                  setAgree(!agree);
                  setIsTyping(true);
                }}
                className={styles.checkbox}
              />
              <label className={styles.agree}>
                Συμφωνώ με τους{" "}
                <a
                  href="/terms-of-service"
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <b>Όρους Χρήσης</b>
                </a>{" "}
                και την{" "}
                <a
                  href="/privacy-policy"
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <b>Πολιτική Απορρήτου</b>
                </a>
              </label>
            </span>
            <div>
              <br />
            </div>
            <div className={styles.recaptchaContainer}>
              <ReCAPTCHA
                sitekey="6LeukkkqAAAAAF3cMjAqfU5PcQhLGVm31rVDj3dK"
                onChange={(token) => {
                  setRecaptchaToken(token);
                  setIsTyping(true);
                }}
                onExpired={() => {
                  setRecaptchaToken(null);
                  validateInput(
                    username,
                    email,
                    password,
                    verifyPassword,
                    null,
                    agree,
                    setIsTyping,
                    setIsLoading,
                    setErrors
                  );
                }}
              />
            </div>
            <div>
              <br />
            </div>
            <button
              type="submit"
              className={`${styles.button} ${
                isLoading || errors.length !== 0
                  ? isLoading
                    ? styles.disabled
                    : styles.error
                  : ""
              }`}
              disabled={isLoading}
            >
              {isLoading || errors.length !== 0
                ? isLoading
                  ? "Περιμένετε..."
                  : "Διορθώστε " +
                    (errors.length !== 1 ? "τα σφάλματα" : "το σφάλμα")
                : "Εγγραφή"}
            </button>
            <p className={styles.loginPrompt}>
              Έχετε ήδη λογαριασμό;{" "}
              <a href="/login" className={styles.link}>
                <b>Συνδεθείτε</b>
              </a>
            </p>
          </form>
        )}
        <Errors
          errors={errors}
          currentErrorIndex={currentErrorIndex}
          setCurrentErrorIndex={setCurrentErrorIndex}
        />
      </div>
    </div>
  );
};

export default Register;