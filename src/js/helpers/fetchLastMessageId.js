export const fetchLastMessageId = async () => {
    try {
      const response = await fetch("https://seismologos.onrender.com/chat/last", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      return response;
    } catch (error) {
      throw error; 
    }
  };