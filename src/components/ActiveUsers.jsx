import React, { useState, useEffect, useRef } from "react";
import { useSession } from "../contexts/SessionContext";
import { formatNumber } from "../js/helpers/formatNumber";
import styles from "./activeUsers.module.css";
import SearchBar from "./SearchBar"; 

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
      <div className={styles.textShort}>{status.textShort}</div>
    </div>
  );
};

const UsersActive = ({ searchElements }) => {
  const activeUsers = searchElements?.filter(status => status.textShort === "τώρα").sort((a, b) => a.elapsedTime - b.elapsedTime);
  return (
    <div className={styles.userListWrapper}>
      {activeUsers && activeUsers.length > 0 && (
        activeUsers.map((status, index) => (
          <UserItem key={index} status={status} />
        ))
      )}
    </div>
  );
};

const UsersRecentlyActive = ({ searchElements }) => {
  const recentlyActiveUsers = searchElements?.filter(status => status.textShort !== "τώρα");
  return (
    <div className={styles.userListWrapper}>
      {recentlyActiveUsers && recentlyActiveUsers.length > 0 && (
        recentlyActiveUsers.map((status, index) => (
          <UserItem key={index} status={status} />
        ))
      )}
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
          ({formatNumber(searchElements?.filter(status => status.textShort === "τώρα").length)})
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
          ({formatNumber(searchElements?.filter(status => status.textShort !== "τώρα").length)})
        </div>
      </div>
    </div>
  );
};

const ActiveUsers = () => {
  if(!localStorage.getItem("selectedListActiveUsers"))
    localStorage.setItem("selectedListActiveUsers", "now");

  if(!JSON.parse(localStorage.getItem("showActiveUsersPanel")))
    localStorage.setItem("showActiveUsersPanel", false);

  const { userStatuses } = useSession();
  const [selectedList, setSelectedList] = useState(localStorage.getItem("selectedListActiveUsers"));
  const [show, setShow] = useState(JSON.parse(localStorage.getItem("showActiveUsersPanel")));
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(userStatuses);

  const handleToggleShow = () => {
    localStorage.setItem("showActiveUsersPanel", !JSON.parse(localStorage.getItem("showActiveUsersPanel")));
    setShow(!show);
  };

  useEffect(() => {
    setSearchResults(userStatuses);
  }, [userStatuses]);

  return (
    <>
      <img 
        className={`${styles.show} ${show ? styles.showShown : ''}`} 
        src={show ? "../assets/collapseList.svg" : "../assets/showList.svg"} 
        alt={show ? "Απόκρυψη" : "Εμφάνιση"} 
        onClick={handleToggleShow} 
      />
      {(show && searchResults) && 
        <div className={styles.wrapper}>
          <div className={styles.heading}>Συνδεδεμένοι Χρήστες</div>
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
            barClassName={styles.searchBar}
          />
          {selectedList === "now" && <UsersActive searchElements={searchResults} />}
          {selectedList === "recent" && <UsersRecentlyActive searchElements={searchResults} />}
        </div>
      }
    </>
  );
};

export default ActiveUsers;
