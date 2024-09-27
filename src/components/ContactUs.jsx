import React from 'react';
import { useEffect } from 'react';

const ContactUs = () => { 
    useEffect(() => {
        document.title = "Επικοινωνήστε Μαζί Μας";
      }, []);

    return (
        <h1>Επικοινωνήστε Μαζί Μας todo page</h1>      
    );
};

export default ContactUs;