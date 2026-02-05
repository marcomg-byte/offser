/**
 * Capitalizes the first letter of a single word and converts the rest to lowercase.
 *
 * Takes a word string and transforms it to have only the first character uppercase
 * and all remaining characters lowercase. Used internally by capitalizeString()
 * to format individual words.
 *
 * @param {string} word - A single word string to capitalize.
 *
 * @returns {string} The word with the first character uppercase and remaining
 *         characters in lowercase.
 *
 * @example
 * capitalizeWord('hello');
 * // → 'Hello'
 *
 * @example
 * capitalizeWord('WORLD');
 * // → 'World'
 *
 * @example
 * capitalizeWord('jAvAsCrIpT');
 * // → 'Javascript'
 */
const capitalizeWord = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

/**
 * Capitalizes the first letter of each word in a string while preserving spaces.
 *
 * Splits the input string by spaces, capitalizes the first letter of each word
 * using capitalizeWord(), then joins them back together with spaces preserved.
 * This is useful for formatting titles, labels, and user-facing text.
 *
 * @param {string} value - The string to transform. Can contain multiple words
 *        separated by spaces.
 *
 * @returns {string} The transformed string with each word capitalized and spaces
 *         preserved. First letter of each word is uppercase, rest lowercase.
 *
 * @example
 * capitalizeString('hello world');
 * // → 'Hello World'
 *
 * @example
 * capitalizeString('internal server error');
 * // → 'Internal Server Error'
 *
 * @example
 * capitalizeString('UPPER case MIXED');
 * // → 'Upper Case Mixed'
 */
const capitalizeString = (value: string): string => {
  const words = value.split(' ');
  return words.map(capitalizeWord).join(' ');
};

/**
 * Formats a Date object as a string in 'MM-DD-YYYY HH:mm:ss' format.
 *
 * Pads month, day, hour, minute, and second with leading zeros as needed.
 *
 * @param {Date} date - The Date object to format.
 * @returns {string} The formatted date string.
 *
 * @example
 * formatDate(new Date('2024-02-05T09:07:03'));
 * // → '02-05-2024 09:07:03'
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
};

export { capitalizeString, capitalizeWord, formatDate };
