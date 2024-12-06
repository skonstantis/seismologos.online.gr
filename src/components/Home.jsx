import React, { useEffect } from "react";
import LeftWrapper from "./LeftWrapper";
import StationTest from "./StationTest";

const Home = () => {
  useEffect(() => {
    document.title = "Αρχική - Σεισμοί τώρα στην Ελλάδα";
  }, []);

  return (
    <div>
      <LeftWrapper />
      <StationTest/>
    </div>
  );
};

export default Home;
