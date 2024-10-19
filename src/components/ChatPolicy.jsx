import React from "react";
import { useEffect } from "react";

const ChatPolicy = () => { 
    useEffect(() => {
        document.title = "Κανονισμός Chat";
      }, []);

    return (
        <h1>Κανονισμός Chat todo page</h1>      
    );
};

export default ChatPolicy;