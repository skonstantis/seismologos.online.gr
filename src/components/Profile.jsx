import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./profile.module.css";
import { useSession } from "../contexts/SessionContext";

const ProfileHeader = ({ username }) => (
  <div className={styles.profileHeader}>
    <div className={styles.username}>
      {username}
    </div>
  </div>
);

const Profile = () => {
  useEffect(() => {
    document.title = "Το Προφίλ Μου";
  }, []);

  const { sessionValid, setNotification, username } = useSession();
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
    <ProfileHeader username = {username}/>
  );
};

export default Profile;
