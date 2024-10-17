import React, { useEffect } from "react";
import styles from "./searchBar.module.css";

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
        element.username.toLowerCase().includes(searchTerm.toLowerCase())
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

export default SearchBar;
