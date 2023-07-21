import { useEffect, useState } from "react";

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(initialValue);

    useEffect(() => {
        // Retrieve from localStorage
        const item = window.localStorage.getItem(key);
        if (item) {
            if (item !== "undefined") {
            setStoredValue(JSON.parse(item));
            } else {
                setStoredValue(item);
            }
        }
    }, [key]);

    const setValue = (value) => {
        // Save state
        setStoredValue(value);
        // Save to localStorage
        window.localStorage.setItem(key, JSON.stringify(value));
    };
    return [storedValue, setValue];
};

export default useLocalStorage;
