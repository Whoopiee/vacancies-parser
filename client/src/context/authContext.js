import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user") || null));

    const login = async (inputs) => {
        const res = await axios.post("/auth/login", inputs);
        setCurrentUser(res.data);
    }

    const logout = async () => {
        await axios.post("/auth/logout");
        setCurrentUser(null);
    }

    const change = async (id) => {
        const res = await axios.get(`/profile/${id}`);
        setCurrentUser(res.data);
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, change }}>{children}</AuthContext.Provider>
    )
}
