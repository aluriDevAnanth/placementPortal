import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const AuthCon = createContext({});

export function AuthPro({ children }) {
    const [auth, setAuth] = useState(Cookies.get("token"));
    const [user, setUser] = useState(null);

    async function fetchUser() {
        try {
            const response = await fetch('http://localhost:3000/api/auth', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth}`,
                },
            });
            const res = await response.json();
            if (res.data.role === 'dean' && localStorage.getItem('role')) {
                let q = { ...res.data.user, role: localStorage.getItem('role') }
                setUser(q)
            } else {
                let q = { ...res.data.user, role: res.data.role }
                setUser(q)
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    useEffect(() => {
        if (auth !== undefined) {
            fetchUser();
        }
    }, [auth]);

    return (
        <AuthCon.Provider value={{ auth, setAuth, user, setUser }}>{children}</AuthCon.Provider>
    );
}

export default AuthCon;
