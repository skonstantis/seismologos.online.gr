export const validateInput = async (username, email, password, verifyPassword, recaptchaToken, setIsTyping, setIsLoading, setErrors) => {
  
    setIsTyping(false);
    setIsLoading(true);
    
    try {
      const response = await fetch(
        "https://seismologos.onrender.com/validate/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const result = await response.json();
      let errorMessages = [];

      if (!response.ok) {
        errorMessages = await result.errors.map(
          (err) => err.msg || "ΣΦΑΛΜΑ: Άγνωστο Σφάλμα"
        );
      }

      if (password !== verifyPassword) {
        errorMessages.push("Οι κωδικοί πρόσβασης δεν ταιριάζουν");
      }

      if (!recaptchaToken) {
        errorMessages.push("Συμπληρώστε το ReCAPTCHA για να συνεχίσετε");
      }

      setErrors(errorMessages);
    } catch (error) {
      setErrors([`ERROR: ${error.message}`]);
    } finally {
      setIsLoading(false);
    }
  };