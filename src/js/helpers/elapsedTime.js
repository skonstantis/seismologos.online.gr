export const formatElapsedTime = (elapsedTime) => {

    if(elapsedTime == 0)
    {
        return 'ενεργός τώρα';
    }

    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) {
        return `ενεργός ${seconds} ${seconds === 1 ? 'δευτερόλεπτο' : 'δευτερόλεπτα'} πρίν`;
    } else if (minutes < 60) {
        return `ενεργός ${minutes} ${minutes === 1 ? 'λεπτό' : 'λεπτά'} πρίν`;
    } else if (hours < 24) {
        return `ενεργός ${hours} ${hours === 1 ? 'ώρα' : 'ώρες'} πρίν`;
    } else if (days < 7) {
        return `ενεργός ${days} ${days === 1 ? 'μέρα' : 'μέρες'} πρίν`;
    } else {
        return `ενεργός ${weeks} ${weeks === 1 ? 'εβδομάδα' : 'εβδομάδες'} πρίν`;
    }
};

export const formatElapsedTimeShort = (elapsedTime) => {

    if(elapsedTime == 0)
    {
        return 'τώρα';
    }

    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) {
        return `${seconds}δ`;
    } else if (minutes < 60) {
        return `${minutes}λ`;
    } else if (hours < 24) {
        return `${hours}ω`;
    } else if (days < 7) {
        return `${days}μ`;
    } else {
        return `${weeks}ε `;
    }
};