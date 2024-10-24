import React, { useState, useEffect, useRef } from "react";
import { useSession } from "../contexts/SessionContext";
import { formatElapsedTimeShort } from "../js/helpers/elapsedTime";
import { formatNumber } from "../js/helpers/formatNumber";
import styles from "./activeUsers.module.css";
import SearchBar from "./SearchBar"; 

const forceRenderTimeout = 10000; //ms

const UserItem = ({ status }) => {
  const usernameRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (usernameRef.current) {
        setIsOverflowing(usernameRef.current.scrollWidth > usernameRef.current.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [status.username]);

  return (
    <div className={styles.user}>
      <div className={styles.username} ref={usernameRef}>
        <div className={isOverflowing ? styles.usernameScroll : ""}>
          {status.username}
        </div>
      </div>
      <div className={styles.textShort}>{status.lastActive == 0 ? "τώρα" : formatElapsedTimeShort(Date.now() - status.lastActive)}</div>
    </div>
  );
};

const UsersActive = ({ searchElements }) => {
  const activeUsers = searchElements?.filter(status => status.lastActive === 0);
  return (
    <div className={styles.userListWrapperOuter}>
      <div className={styles.userListWrapperInner}>
        {activeUsers && activeUsers.length > 0 && (
          activeUsers.map((status, index) => (
            <UserItem key={index} status={status} />
          ))
        )}
      </div>
    </div>
  );
};

const UsersRecentlyActive = ({ searchElements }) => {
  const [, setForceRender] = useState(0); 

  useEffect(() => {
    const intervalId = setInterval(() => {
        setForceRender(prev => prev + 1); 
    }, forceRenderTimeout); 

    return () => clearInterval(intervalId);
  }, []);
  
  const recentlyActiveUsers = searchElements?.filter(status => status.lastActive !== 0);
  return (
    <div className={styles.userListWrapperOuter}>
      <div className={styles.userListWrapperInner}>
        {recentlyActiveUsers && recentlyActiveUsers.length > 0 && (
          recentlyActiveUsers.map((status, index) => (
            <UserItem key={index} status={status} />
          ))
        )}
      </div>
    </div>
  );
};


const ActiveUsersNav = ({ searchElements, selectedList, setSelectedList }) => {
  return (
    <div className={styles.activeUsersNavContainer}>
      <div
        className={`${styles.activeUsersNavButton} ${selectedList === "now" ? styles.active : ""}`}
        onClick={() => 
          {
            localStorage.setItem("selectedListActiveUsers", "now");
            setSelectedList("now");
          }
        }
      >
        <div>
          Τώρα
          <br />
          ({formatNumber(searchElements?.filter(status => status.lastActive === 0).length)})
        </div>
      </div>
      <div
        className={`${styles.activeUsersNavButton} ${selectedList === "recent" ? styles.active : ""}`}
        onClick={() => 
          {
            localStorage.setItem("selectedListActiveUsers", "recent");
            setSelectedList("recent");
          }
        }
      >
        <div>
          Πρόσφατα
          <br />
          ({formatNumber(searchElements?.filter(status => status.lastActive !== 0).length)})
        </div>
      </div>
    </div>
  );
};

const ActiveUsers = () => {
  if (!localStorage.getItem("selectedListActiveUsers")) {
    localStorage.setItem("selectedListActiveUsers", "now");
  }

  if (!JSON.parse(localStorage.getItem("showActiveUsersPanel"))) {
    localStorage.setItem("showActiveUsersPanel", false);
  }

  const { userStatuses } = useSession();
  const [selectedList, setSelectedList] = useState(localStorage.getItem("selectedListActiveUsers"));
  const [show, setShow] = useState(JSON.parse(localStorage.getItem("showActiveUsersPanel")));
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(userStatuses || []); 

  const handleToggleShow = () => {
    const newShowStatus = !JSON.parse(localStorage.getItem("showActiveUsersPanel"));
    localStorage.setItem("showActiveUsersPanel", newShowStatus);
    setShow(newShowStatus);
  };

  useEffect(() => {
    if (userStatuses) {
      const filteredResults = userStatuses.filter(status =>
        status.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]); 
    }
  }, [userStatuses, searchTerm]);

  const isActiveListEmpty = selectedList === "now"
    ? searchResults.filter(status => status.lastActive === 0).length === 0
    : searchResults.filter(status => status.lastActive !== 0).length === 0;

  return (
    <>
      <div className={styles.wrapper}>
        <img 
          className={styles.show} 
          src={show ? "../assets/collapseList.svg" : "../assets/showList.svg"} 
          alt={show ? "Απόκρυψη" : "Εμφάνιση"} 
          onClick={handleToggleShow} 
        />
        {!show && searchResults && 
          <>
            <div className={styles.headingClosed}>
                <img className={styles.usersIcon} src="../assets/activeUsers.svg" alt="Συνδεδεμένοι Χρήστες" />
            </div>
            <br/>
          </>
        }
        {show && searchResults && (
          <div>
            <div className={styles.heading}>
                <img className={styles.usersIcon} src="../assets/activeUsers.svg" alt="Συνδεδεμένοι Χρήστες" /></div>
            <ActiveUsersNav 
              searchElements={searchResults} 
              selectedList={selectedList} 
              setSelectedList={setSelectedList} 
            />
            <SearchBar
              searchElements={userStatuses}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setSearchResults={setSearchResults}
              inputClassName={styles.searchInput} 
              barClassName={isActiveListEmpty ? styles.searchBarEmpty : styles.searchBar}
            />
            {selectedList === "now" && <UsersActive searchElements={searchResults} />}
            {selectedList === "recent" && <UsersRecentlyActive searchElements={searchResults} />}
          </div>
        )}
      </div>
    </>
  );
};

export default ActiveUsers;
