import { useEffect, useState } from "react";

/**
 *
 * @param {string} key - The name of the stored value
 * @param {*} initialValue The initial value of the stored value (if not provided will be "")
 * @returns The value and the setter function for the value
 */

function useLocalStorage(key, initialValue = "") {
  // Initialize state with initialValue (safe for SSR)
  const [value, setValue] = useState(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, [key]);

  useEffect(() => {
    if (isClient) {
      try {
        if (value === null || value === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  }, [value, key, isClient]);

  return [value, setValue];
}

export default useLocalStorage;
