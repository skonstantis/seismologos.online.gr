export const formatNumber = (num) => {
    if (num < 1000) {
      return num.toString();
    } else if (num >= 1000 && num < 1000000) {
      const floored = Math.floor(num / 100) / 10; 
      return `${floored} χιλ`;
    } else {
      const floored = Math.floor(num / 100000) / 10; 
      return `${floored} εκ`;
    }
  };