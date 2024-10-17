import React from "react";
import { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Πολιτική Απορρήτου";
  }, []);

  return (
    <h1>Πολιτική Απορρήτου todo page</h1>
  );
};

export default PrivacyPolicy;
