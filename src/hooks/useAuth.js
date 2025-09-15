import { useState, useEffect } from "react";
import api from '../services/api'


export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(false);

    const [loginError, setLoginError] = useState('');


    //username update
    const [isUsernameUpdating, setIsUsernameUpdating] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [usernameSuccess, setUsernameSuccess] = useState('');


    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setIsAuthLoading(true);


                const response = await api.get('/api/auth/status');
                console.log('Auth status response:', response);
                console.log('Auth status data:', response.data);

                if (response.data && response.data.authenticated && response.data.user) {
                    console.log('User authenticated:', response.data.user);
                    setUser(response.data.user);
                    setIsLoggedIn(true);
                    return;
                } else {
                    console.log('Not authenticated - server response:', response.data);
                }
            } catch (err) {
                console.error("Auth status check failed", err.response?.data || err.message);
            } finally {
                setIsAuthLoading(false);
            }
        };

        checkAuthStatus();


        const cleanup = window.electronAPI.onLoginFlowComplete(()=>{
            console.log('Login flow complete, re-checking auth status...');
            setTimeout(() => checkAuthStatus(), 1500); // Slight delay to ensure cookies are set
        });

        return () => {
            cleanup();
        };
    }, []);

    const loginWithProvider = async (provider) => { // provider would be 'google', 'github', etc.
        setIsAuthLoading(true);
        setLoginError('');
        try {
            await window.electronAPI.startLogin(provider);
        }
        catch (err) {
            console.error('Login failed:', err);
            setLoginError('Login failed. Please try again.');
        }
        finally {
            setIsAuthLoading(false);
        }

    };


 
    const handleLogout = async () => {
        try {
            await api.get('/api/auth/logout')
            setIsLoggedIn(false);
            setUser(null);
        }
        catch (err) {
            console.error(err);
        }
    };

    const updateUsername = async (newUsername) => {
        setIsUsernameUpdating(true);
        setUsernameError('');
        setUsernameSuccess('');
        //mock execution, for debugging until doing backend
        //to be replaced with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (newUsername.length >= 4) {
            console.log('Username has been updated.');
            setUsernameSuccess('Username updated successfully!');
        } else {
            setUsernameError('Username must be at least 4 characters long.');
        }
        setIsUsernameUpdating(false);
    };



    return ({
        isLoggedIn,
        user,
        isAuthLoading,
        loginError,
        handleLogout,
        updateUsername,
        loginWithProvider,
        isUsernameUpdating,
        usernameError,
        usernameSuccess


    });
}