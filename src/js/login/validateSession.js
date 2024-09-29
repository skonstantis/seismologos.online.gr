export const validateSession = async () => {
  try {
    const token = localStorage.getItem("authToken");

    if (token == null) {
      return false; 
    }

    const response = await fetch(
      "https://seismologos.onrender.com/validate/session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return false;
    }

    localStorage.setItem("authToken", result.token);
    localStorage.setItem("username", result.user.username);
    localStorage.setItem("email", result.user.email);
    localStorage.setItem("id", result.user.id);
    localStorage.setItem("lastLogin", result.user.lastLogin); 
    console.log(result.user.lastLogin);
    return true;
  } catch (error) {
    console.error(error);
  }
};
