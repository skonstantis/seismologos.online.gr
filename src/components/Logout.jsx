import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";
import Errors from "./Errors";
import Loading from "./Loading";
import styles from "./logout.module.css"
const Logout = () => {
  useEffect(() => {
    document.title = "Αποσύνδεση";
  }, []);
  
  const { sessionValid, setNotification } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const innerRedirect = queryParams.get("innerRedirect"); 

  useEffect(() => {
    if (!sessionValid && !innerRedirect) {
      const notificationMessage = (
        <div>Αυτό το σημείο σύνδεσης είναι διαθέσιμο μόνο αν είστε συνδεδεμένοι<br/>Έγινε ανακατεύθηνση στην Αρχική</div>
      );
      setNotification(notificationMessage, "red");
      navigate("/"); 
    }
  }, [sessionValid, innerRedirect, setNotification, navigate]);

  if (!sessionValid) return null;

  const [errors, setErrors] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const logout = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const id = localStorage.getItem("id");
      const username = localStorage.getItem("username");

      try {
        const response = await fetch(
            "https://seismologos.onrender.com/users/logout",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token, username, id }),
            }
        );

        const result = await response.json();
        
        if (response.ok) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("id");

          sessionStorage.setItem("notifications", "[\"Επιτυχής Αποσύνδεση\"]");
          sessionStorage.setItem("notificationsColors", "[\"green\"]");

          const redirectUrl = innerRedirect ? "/?innerRedirect=true" : "/";
          window.location.replace(redirectUrl); 
        } else {
          const errorMessages = result.errors.map(
            (err) => err.msg || "ΣΦΑΛΜΑ: Άγνωστο Σφάλμα"
          );
          setErrors(errorMessages);
        }
      } catch (error) {
        setErrors(["An error occurred."]);
      } finally {
        setIsLoading(false); 
      }
    };

    logout();
  }, [innerRedirect]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Γίνεται Αποσύνδεση</h1>
        <Errors
          errors={errors}
          currentErrorIndex={currentErrorIndex}
          setCurrentErrorIndex={setCurrentErrorIndex}
        />
    </div>
    </div>
  );
};

export default Logout;