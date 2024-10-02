export const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp));

    if (isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };