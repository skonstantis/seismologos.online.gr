import React from "react";
import { useEffect } from "react";

const TermsOfService = () => {
  useEffect(() => {
    document.title = "Όροι Χρήσης";
  }, []);

  return (
      <h1>Όροι Χρήσης todo page</h1>
  );
};

export default TermsOfService;
