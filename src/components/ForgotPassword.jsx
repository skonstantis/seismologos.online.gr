import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./forgotPassword.module.css";
import Errors from "./Errors";
import Loading from "./Loading";
import { useSession } from "../contexts/SessionContext";

const ForgotPassword = () => {
  useEffect(() => {
    document.title = "Ξέχασα τον Κωδικό Πρόσβασης μου";
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

  const [confirmationMessage, setConfirmationMessage] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://seismologos.onrender.com/validate/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setErrors([]);
        setConfirmationMessage(true);
        const notificationMessage = <div>Το e-mail στάλθηκε επιτυχώς</div>;
        setNotification(notificationMessage, "green");
      } else {
        let errorMessages = result.errors.map(
          (err) => err.msg || "ΣΦΑΛΜΑ: Άγνωστο Σφάλμα"
        );
        setErrors(errorMessages);
      }
    } catch (error) {
      setErrors([`ERROR: ${error.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Ξέχασα τον Κωδικό Πρόσβασης μου</h1>
        {confirmationMessage ? (
          <div className={styles.confirmationMessage}>
            <p>Εάν το email που παραχωρήσατε αντιστοιχεί σε επιβεβαιωμένο λογαριασμό, σας έχουμε στείλει έναν σύνδεσμο στο email σας.</p> 
            <p>Ακολουθήστε τις οδηγίες που θα βρείτε εκεί προκειμένου να αλλάξετε τον κωδικό σας.</p>
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
                name="email"
                placeholder="Πληκτρολογήστε το e-mail σας"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
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
                : "Αποστολή e-mail"}
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

export default ForgotPassword;
