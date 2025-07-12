import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setisDark] = useState(() => {
        const stored = localStorage.getItem("theme");
        return stored ? stored === "dark" : true;
    })


    useEffect(() => {
        const root = document.documentElement
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }

    }, [isDark])

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme: () => setisDark(prev => !prev) }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);