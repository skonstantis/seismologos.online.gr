import React from "react";
import { useEffect } from "react";

const Faq = () => { 
    useEffect(() => {
        document.title = "FAQ";
      }, []);

    return (
        <h1>FAQ todo page</h1>      
    );
};

export default Faq;