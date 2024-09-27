import React from 'react';
import { useEffect } from 'react';

const Login = () => { 
    useEffect(() => {
        document.title = "Σύνδεση Χρήστη";
      }, []);

    return (
        <h1>Σύνδεση Χρήστη todo page</h1>      
    );
};

export default Login;