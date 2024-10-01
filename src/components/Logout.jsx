import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";
import Errors from "./Errors";
import Loading from "./Loading";

const Logout = () => {

  useEffect(() => {
    document.title = "Αποσύνδεση";
  }, []);

  const [errors, setErrors] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { sessionValid, loading } = useSession();

  useEffect(() => {
    if (!sessionValid) {
      navigate("/");
    }
  }, [sessionValid, navigate]);

  useEffect(() => {
    const logout = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const id = localStorage.getItem("id");

      try {
        const response = await fetch(
            "https://seismologos.onrender.com/users/logout",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token, id }),
            }
          );
        const result = await response.json();
        if (response.ok) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            localStorage.removeItem("lastLogin");
            localStorage.removeItem("id");
            window.location.reload();
        } else {
          let errorMessages = result.errors.map(
            (err) => err.msg || "ΣΦΑΛΜΑ: Άγνωστο Σφάλμα"
          );
          setErrors(errorMessages);
          setIsLoading(false);
        }
      } catch (error) {
        setErrors(["An error occurred."]);
      }
    };

    logout();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
        <Errors
          errors={errors}
          currentErrorIndex={currentErrorIndex}
          setCurrentErrorIndex={setCurrentErrorIndex}
        />
  );
};

export default Logout;
