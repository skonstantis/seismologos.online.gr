import React, { useState } from "react";
import { useSession } from "../contexts/SessionContext";
import { formatNumber } from "../js/helpers/formatNumber";
import styles from "./activeUsers.module.css"; 

const UsersActive = ({ userStatuses }) => {
  const activeUsers = userStatuses?.filter(status => status.textShort === 'τώρα');
  return (
    <div className={styles.userListWrapper}>
      {activeUsers && activeUsers.length > 0 ? (
        activeUsers.map((status, index) => (
          <div className={styles.userNow} key={index}>
            {status.username}
          </div>
        ))
      ) : (
        <div className={styles.none}>Κανένας</div>
      )}
    </div>
  );
};

const UsersRecentlyActive = ({ userStatuses }) => {
  const recentlyActiveUsers = userStatuses?.filter(status => status.textShort !== 'τώρα');
  return (
    <div className={styles.userListWrapper}>
      {recentlyActiveUsers && recentlyActiveUsers.length > 0 ? (
        recentlyActiveUsers.map((status, index) => {
          const usernameRef = React.useRef(null);
          const [isOverflowing, setIsOverflowing] = useState(false);

          React.useEffect(() => {
            const checkOverflow = () => {
              if (usernameRef.current) {
                setIsOverflowing(usernameRef.current.scrollWidth > usernameRef.current.clientWidth);
              }
            };

            checkOverflow();
            window.addEventListener('resize', checkOverflow);
            return () => window.removeEventListener('resize', checkOverflow);
          }, [status.username]);

          return (
            <div className={styles.user} key={index}>
              <div className={styles.username} ref={usernameRef}>
                <div className={isOverflowing ? styles.usernameScroll : ""}>
                  {status.username}
                </div>
              </div>
              <div className={styles.textShort}>
                {status.textShort}
              </div>
            </div>
          );
        })
      ) : (
        <div className={styles.none}>Κανένας</div>
      )}
    </div>
  );
};

const ActiveUsersNav = ({ userStatuses, selectedList, setSelectedList }) => {
  return (
    <div className={styles.activeUsersNavContainer}>
      <div
        className={`${styles.activeUsersNavButton} ${selectedList === 'now' ? styles.active : ''}`}
        onClick={() => setSelectedList('now')}
      >
        <div>
          Τώρα
          <br />
          ({formatNumber(userStatuses?.filter(status => status.textShort === 'τώρα').length)})
        </div>
      </div>
      <div
        className={`${styles.activeUsersNavButton} ${selectedList === 'recent' ? styles.active : ''}`}
        onClick={() => setSelectedList('recent')}
      >
        <div>
          Πρόσφατα
          <br />
          ({formatNumber(userStatuses?.filter(status => status.textShort !== 'τώρα').length)})
        </div>
      </div>
    </div>
  );
};

const ActiveUsers = () => {
  const { userStatuses } = useSession();
  const [selectedList, setSelectedList] = useState('now');

  return (
    <div className={styles.leftWrapper}>
      <div className={styles.heading}>Συνδεδεμένοι Χρήστες</div>
      <ActiveUsersNav userStatuses={userStatuses} selectedList={selectedList} setSelectedList={setSelectedList} />
      {selectedList === 'now' && <UsersActive userStatuses={userStatuses} />}
      {selectedList === 'recent' && <UsersRecentlyActive userStatuses={userStatuses} />}
    </div>
  );
};

export default ActiveUsers;
