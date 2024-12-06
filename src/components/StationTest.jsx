import React from "react";
import { useSession } from "../contexts/SessionContext";
import styles from "./stationTest.module.css";

const StationTest = () => {
  const { sensorData } = useSession();

  // Parse sensorData value
  let value = 0;
  if (sensorData) {
    try {
      value = parseFloat(sensorData);
      if (isNaN(value)) {
        value = 0; // Fallback to 0 if parsing fails
      }
    } catch (e) {
      value = 0; // Fallback to 0 if any error occurs
    }
  }

  // Round value to the nearest whole number
  const roundedValue = Math.max(0, Math.min(Math.round(value), 12)); // Clamp value between 0 and 12

  return (
    <div className={styles.wrapper}>
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

export default StationTest;
