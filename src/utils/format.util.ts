const capitalizeWord = (word: string): string => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

const capitalizeString = (value: string): string => {
    const words = value.split(' ');
    return words.map(capitalizeWord).join('');
};

export { capitalizeString, capitalizeWord };