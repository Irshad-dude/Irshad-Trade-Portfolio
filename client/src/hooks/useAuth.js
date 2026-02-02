import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for admin authentication
 */
export function useAuth() {
    const [isAdmin, setIsAdmin] = useState(false);

    // Check session storage on mount
    useEffect(() => {
        const storedAuth = sessionStorage.getItem('adminLoggedIn');
        if (storedAuth === 'true') {
            setIsAdmin(true);
        }
    }, []);

    const login = useCallback((password) => {
        // Simple hardcoded password (same as original)
        if (password === 'admin123') {
            setIsAdmin(true);
            sessionStorage.setItem('adminLoggedIn', 'true');
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setIsAdmin(false);
        sessionStorage.removeItem('adminLoggedIn');
    }, []);

    const verifyDeletePassword = useCallback((password) => {
        return password === 'Gk1d#';
    }, []);

    return {
        isAdmin,
        login,
        logout,
        verifyDeletePassword
    };
}

export default useAuth;
