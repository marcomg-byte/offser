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

export { capitalizeString, capitalizeWord };
