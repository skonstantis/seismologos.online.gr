import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./profile.module.css";
import { useSession } from "../contexts/SessionContext";

const ProfileHeader = ({ usernameRef }) => (
  <div className={styles.profileHeader}>
    <div className={styles.username}>
      {usernameRef.current}
    </div>
  </div>
);

const Profile = () => {
  useEffect(() => {
    document.title = "Το Προφίλ Μου";
  }, []);

  const { sessionValid, setNotification, usernameRef } = useSession();
  const navigate = useNavigate();  

  useEffect(() => {
    if (!sessionValid) {
      const notificationMessage = <div>Αυτό το σημείο σύνδεσης δεν είναι διαθέσιμο ενώ δεν είστε συνδεδεμένοι<br/>Έγινε ανακατεύθηνση στην Αρχική</div>;
      setNotification(notificationMessage, "red");
      navigate("/"); 
    }
  }, [sessionValid, setNotification, navigate]);

  if (!sessionValid) return null; 

  return (
    <ProfileHeader usernameRef = {usernameRef}/>
  );
};

export default Profile;
