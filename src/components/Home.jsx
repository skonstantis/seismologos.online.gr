import React, { useEffect } from "react";
import LeftWrapper from "./LeftWrapper";

const Home = () => {
  useEffect(() => {
    document.title = "Αρχική - Σεισμοί τώρα στην Ελλάδα";
  }, []);

  return (
    <div>
      <LeftWrapper />
    </div>
  );
};

export default Home;
