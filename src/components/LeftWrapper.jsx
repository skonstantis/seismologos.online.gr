import React from "react";
import ActiveUsers from "./ActiveUsers"; 
import styles from "./leftWrapper.module.css";

const LeftWrapper = () => {
  return (
    <div className={styles.leftWrapper}>
      <ActiveUsers /> 
    </div>
  );
};

export default LeftWrapper;
