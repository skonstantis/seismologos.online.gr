import React from "react";
import ActiveUsers from "./ActiveUsers"; 
import Chat from "./Chat";
import styles from "./leftWrapper.module.css";

const LeftWrapper = () => {
  return (
    <div className={styles.leftWrapper}>
      <ActiveUsers /> 
      <Chat />
    </div>
  );
};

export default LeftWrapper;
