import React from "react";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "Αρχική - Σεισμοί τώρα στην Ελλάδα";
  }, []);

  return (
    <div>
      <h1>Αρχική todo page</h1>
    </div>
  );
};

export default Home;
