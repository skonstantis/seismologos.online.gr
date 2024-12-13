import React, { useState, useEffect, useRef } from "react";
import { useSession } from "../contexts/SessionContext";
import styles from "./activeSensors.module.css";

const forceRenderTimeout = 10000; //ms

const SearchBar = ({
  searchElements,
  searchTerm,
  setSearchTerm,
  setSearchResults,
  placeholder = "Αναζήτηση",
  inputClassName,
  barClassName,
}) => {
  useEffect(() => {
    if (Array.isArray(searchElements)) { 
      const results = searchElements.filter(element =>
        element.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]); 
    }
  }, [searchTerm, searchElements, setSearchResults]);

  return (
    <div className={barClassName || styles.searchBar}>
      <input
        type="text"
        className={inputClassName || styles.searchInput}
        placeholder={placeholder}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

const SensorItem = ({ sensor, color }) => {
  const sensorIdRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (sensorIdRef.current) {
        setIsOverflowing(sensorIdRef.current.scrollWidth > sensorIdRef.current.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [sensor.id]);

  const data = sensor.data || 0;
  const roundedValue = sensor.data > 0 ? sensor.data > 11 ? 12 : Math.floor(sensor.data) + 1 : 0;

  return (
    <div className={`${styles.sensor} ${color === "light" ? styles.light : styles.dark}`}>
      <div className={styles.id} ref={sensorIdRef}>
        <div className={isOverflowing ? styles.idScroll : ""}>
          {sensor.id}
        </div>
      </div>
      {!sensor.active && <div className={styles.offline}>
        {"•"}
      </div>}      
      {sensor.active && <div className={styles.intensity}>
        <img className={styles.intensity} src={`../assets/int-${roundedValue}.svg`} alt={`${roundedValue}`} />
      </div>}
    </div>
  );
};

const SensorsActive = ({ searchElements }) => {
  const activeSensors = searchElements?.filter(sensor => sensor.active);
  let i = 0;
  return (
    <div className={styles.sensorListWrapperOuter}>
      <div className={styles.sensorListWrapperInner}>
        {activeSensors && activeSensors.length > 0 && (
          activeSensors.map((sensor, index) => (
            <SensorItem key={index} sensor={sensor} color={i++ % 2 === 0 ? "light" : "dark"} />
          ))
        )}
      </div>
    </div>
  );
};

const SensorsInactive = ({ searchElements }) => {
  const [, setForceRender] = useState(0); 

  useEffect(() => {
    const intervalId = setInterval(() => {
        setForceRender(prev => prev + 1); 
    }, forceRenderTimeout); 

    return () => clearInterval(intervalId);
  }, []);
  
  const inactiveSensors = searchElements?.filter(sensor => !sensor.active);
  let i = 0;
  return (
    <div className={styles.sensorListWrapperOuter}>
      <div className={styles.sensorListWrapperInner}>
        {inactiveSensors && inactiveSensors.length > 0 && (
          inactiveSensors.map((sensor, index) => (
            <SensorItem key={index} sensor={sensor} color={i++ % 2 === 0 ? "light" : "dark"} />
          ))
        )}
      </div>
    </div>
  );
};

const SensorsNav = ({ searchElements, selectedList, setSelectedList }) => {
  return (
    <div className={styles.activeSensorsNavContainer}>
      <div
        className={`${styles.activeSensorsNavButton} ${selectedList === "active" ? styles.active : ""}`}
        onClick={() => 
          {
            localStorage.setItem("selectedListActiveSensors", "active");
            setSelectedList("active");
          }
        }
      >
        <div>
          Ενεργοί
          <br />
          ({searchElements?.filter(sensor => sensor.active).length})
        </div>
      </div>
      <div
        className={`${styles.activeSensorsNavButton} ${selectedList === "inactive" ? styles.active : ""}`}
        onClick={() => 
          {
            localStorage.setItem("selectedListActiveSensors", "inactive");
            setSelectedList("inactive");
          }
        }
      >
        <div>
          Αδρανείς
          <br />
          ({searchElements?.filter(sensor => !sensor.active).length})
        </div>
      </div>
    </div>
  );
};

const ActiveSensors = ({ showActiveSensors, setShowActiveSensors, showActiveUsers, setShowActiveUsers, windowWidth }) => {
  if (!localStorage.getItem("selectedListActiveSensors")) {
    localStorage.setItem("selectedListActiveSensors", "active");
  }

  if (!JSON.parse(localStorage.getItem("showActiveSensors"))) {
    localStorage.setItem("showActiveSensors", false);
  }

  const { sensorStatuses } = useSession();
  const [selectedList, setSelectedList] = useState(localStorage.getItem("selectedListActiveSensors"));
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(sensorStatuses || []);

  const handleToggleShow = () => {
    const newShowStatus = !JSON.parse(localStorage.getItem("showActiveSensors"));
    localStorage.setItem("showActiveSensors", newShowStatus);
    setShowActiveSensors(newShowStatus);
  };

  useEffect(() => {
    if(showActiveUsers && showActiveSensors && windowWidth < 768) {
        localStorage.setItem("showActiveUsers", false);
        setShowActiveUsers(false);
    }
  }, [showActiveSensors]);

  useEffect(() => {
    if (sensorStatuses) {
      const filteredResults = sensorStatuses.filter(sensor =>
        sensor.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [sensorStatuses, searchTerm]);

  const isActiveListEmpty = selectedList === "active"
    ? searchResults.filter(sensor => sensor.active).length === 0
    : searchResults.filter(sensor => !sensor.active).length === 0;

  return (
    <>
      <div className={styles.wrapper}>
        <img 
          className={styles.show} 
          src={showActiveSensors ? "../assets/collapseList.svg" : "../assets/showList.svg"} 
          alt={showActiveSensors ? "Απόκρυψη" : "Εμφάνιση"} 
          onClick={handleToggleShow} 
        />
        {!showActiveSensors && searchResults && 
          <>
            <div className={styles.headingClosed}>
                <img className={styles.sensorsIcon} src="../assets/activeSensors.svg" alt="Ενεργοί Αισθητήρες" />
            </div>
            <br/>
          </>
        }
        {showActiveSensors && searchResults && (
          <div>
            <div className={styles.heading}>
                <img className={styles.sensorsIcon} src="../assets/activeSensors.svg" alt="Ενεργοί Αισθητήρες" /></div>
            <SensorsNav 
              searchElements={searchResults} 
              selectedList={selectedList} 
              setSelectedList={setSelectedList} 
            />
            <SearchBar
              searchElements={sensorStatuses}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setSearchResults={setSearchResults}
              inputClassName={styles.searchInput} 
              barClassName={isActiveListEmpty ? styles.searchBarEmpty : styles.searchBar}
            />
            {selectedList === "active" && <SensorsActive searchElements={searchResults} />}
            {selectedList === "inactive" && <SensorsInactive searchElements={searchResults} />}
          </div>
        )}
      </div>
    </>
  );
};

export default ActiveSensors;
