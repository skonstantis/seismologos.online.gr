import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";
import { forceLogout } from "../js/logout/forceLogout";
import styles from "./changePassword.module.css";
import Errors from "./Errors";
import Loading from "./Loading";

const ChangePassword = () => {

  useEffect(() => {
    document.title = "Αλλαγή Κωδικού";
  }, []);
  
  const { sessionValid, setNotification } = useSession();

  useEffect(() => {
    const checkAndLogout = async () => {
      if (sessionValid) {
        await forceLogout();
        sessionStorage.setItem("notifications", "[\"Πραγματοποιήθηκε αναγκαστική αποσύνδεση\"]");
        sessionStorage.setItem("notificationsColors", "[\"red\"]");
        window.location.reload("/?innerRedirect=true");
      }
    };
    checkAndLogout();
  }, [sessionValid, forceLogout]);

  const [showForm, setShowForm] = useState(false);

  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const [showPasswords, setShowPasswords] = useState(false);
  const [errors, setErrors] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const location = useLocation();
  

  useEffect(() => {
    const verifyToken = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (!token) {
        setErrors(["Token is missing"]);
        return;
      }

      try {
        const response = await fetch(
          `https://seismologos.onrender.com/validate/change-password?token=${token}`
        );
        const result = await response.json();
        if (response.ok) {
          setShowForm(true);
        } else {
          let errorMessages = result.errors.map(
            (err) => err.msg || "ΣΦΑΛΜΑ: Άγνωστο Σφάλμα"
          );
          setErrors(errorMessages);
        }
      } catch (error) {
        setErrors(["An error occurred while verifying the token."]);
      }
    };

    verifyToken();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password != verifyPassword) {
      setErrors(["Οι κωδικοί πρόσβασης δεν ταιριάζουν"]);
      return;
    }

    setIsLoading(true);

    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    try {
      const response = await fetch(
        "https://seismologos.onrender.com/validate/change-password-validated",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password }),
        }
      );

      const result = await response.json();
      if (response.ok && password == verifyPassword) {
        setErrors([]);
        const notificationMessage = (
          <div>Ο κωδικός πρόσβασης άλλαξε επιτυχώς<br/>Μπορείτε τώρα να συνδεθείτε</div>
        );
        setNotification(notificationMessage, "green");
        navigate("/login");
      } else {
        let errorMessages = result.errors.map(
          (err) => err.msg || "ΣΦΑΛΜΑ: Άγνωστο Σφάλμα"
        );
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

  if (isLoading) {
    return <Loading />;
  }
  
  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Αλλαγή Κωδικού Πρόσβασης</h1>
        {showForm && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <input
                type={showPasswords ? "text" : "password"}
                name="password"
                placeholder="Νέος Κωδικός Πρόσβασης"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>
            <div>
              <input
                type={showPasswords ? "text" : "password"}
                name="verifyPassword"
                placeholder="Επιβεβαίωση Κωδικού"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="showPassword"
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
            <button
              type="submit"
              className={`${styles.button} ${
                isLoading && errors.length !== 0 ? styles.disabled : ""
              }`}
              disabled={isLoading}
            >
              {isLoading && errors.length !== 0
                ? "Παρακαλώ Περιμένετε..."
                : "Αλλαγή Κωδικού"}
            </button>
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

export default ChangePassword;
