import React from "react";
import { useEffect } from "react";
import { useSession } from "../contexts/SessionContext";
import styles from "./activeSensors.module.css";

const SensorsHeader = () => {
  return <div className={styles.sensorsHeader}></div>;
};

const SensorsBody = ({sensorData}) => {
  let value = 0;
  if (sensorData) {
    try {
      value = parseFloat(sensorData);
      if (isNaN(value)) {
        value = 0; 
      }
    } catch (e) {
      value = 0; 
    }
  }

  const roundedValue = Math.max(0, Math.min(Math.round(value), 12));

  return (
    <div className={styles.sensorsBody}>
      <div className={styles.inner}>
        {sensorData != null ? (
          <img
            src={`../../assets/int-${roundedValue}.svg`}
            alt={`Mercalli Intensity ${roundedValue}`}
            style={{
              width: "50px",
            }}
          />
        ) : (
          <p>Προμηθέας: Αποσυνδεδεμένος</p>
        )}
      </div>
    </div>
  );
};

const ActiveSensors = ({ showActiveSensors, setShowActiveSensors, showActiveUsers, setShowActiveUsers, windowWidth }) => {
  const { sensorStatuses } = useSession();

  const sensorData = sensorStatuses.length !== 0 ? sensorStatuses[0].sensorData : null;

  const handleToggleShow = () => {
    const newShowStatus = !showActiveSensors;
    localStorage.setItem("showActiveSensors", newShowStatus);
    setShowActiveSensors(newShowStatus);
  };

  useEffect(() => {
    if(showActiveUsers && showActiveSensors && windowWidth < 768)
    {
      console.log("in");
      localStorage.setItem("showActiveUsers", false);
      setShowActiveUsers(false);
    }
  }, [showActiveSensors]);

  return (
    <div className={styles.wrapper}>
      <img
        className={`${showActiveSensors ? styles.showShow : styles.show}`}
        src={
          showActiveSensors
            ? "../assets/collapseList.svg"
            : "../assets/showList.svg"
        }
        alt={showActiveSensors ? "Hide" : "Show"}
        onClick={handleToggleShow}
      />
      {!showActiveSensors ? (
        <div className={styles.headingClosed}>
          <img
            className={styles.sensorsIcon}
            src="../assets/activeSensors.svg"
            alt="Active Sensors"
          />
        </div>
      ) : (
        <div>
          <div className={styles.heading}>
            <img
              className={styles.sensorsIconRaw}
              src="../assets/activeSensors.svg"
              alt="Active Sensors"
            />
          </div>
          <SensorsHeader />
          <SensorsBody sensorData={sensorData} />
        </div>
      )}
    </div>
  );
};

export default ActiveSensors;
