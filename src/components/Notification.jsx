import styles from "./notification.module.css";

const Notification = ({ message, color = "green"}) => {

  if(message == "") return null;
  
  return (
    <div
      className={styles.notification}
      style={{ backgroundColor: color }}
    >
      {message}
    </div>
  );
};

export default Notification;