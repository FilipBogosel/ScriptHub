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
            await api.get('/api/auth/logout');
            await window.electronAPI.clearAuthCookies();
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
        try{
            const response = await api.get(`/api/update-username/${encodeURIComponent(user._id)}/${encodeURIComponent(newUsername)}`);
            console.log('Username update response:', response);
            if(response.data && response.data.oldUsername && response.data.newUsername){
                setUser(prevUser => ({...prevUser, username: newUsername}));
                setUsernameSuccess('Username updated successfully!');
                setUsernameError('');
            }
            else{
                const errorMsg = response.data?.message || 'Failed to update username. Please try again.';
                console.error('Username update failed:', errorMsg);
                setUsernameError(errorMsg);
                setIsUsernameUpdating(false);
                return;
            }
        }
        catch(err){
            console.error('Username update failed:', err);
            setUsernameError('Failed to update username. Please try again.');
            setIsUsernameUpdating(false);
            return;
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