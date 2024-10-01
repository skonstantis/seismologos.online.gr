export const forceLogout = async () => {
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
    await response.json();
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("lastLogin");
    localStorage.removeItem("id");
  } catch (error) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("lastLogin");
    localStorage.removeItem("id");
  }
};
