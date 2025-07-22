import { useState, useEffect} from "react";

export function useAuth(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const [loginError, setLoginError] = useState('');


    //username update
    const [isUsernameUpdating, setIsUsernameUpdating] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [usernameSuccess, setUsernameSuccess] = useState('');


    // 2. The NEW function for social logins
    const loginWithProvider = async (provider) => { // provider would be 'google', 'github', etc.
        setIsAuthLoading(true);
        setLoginError('');
        if(provider){
            console.log(`Starting OAuth flow with ${provider}`);
        }
        // This is the key part:
        // In an Electron app, this function would send a message to the
        // Electron main process to start the OAuth flow.
        // e.g., window.electron.startAuth(provider);

        // The main process would then handle opening the Google login window,
        // capturing the redirect, exchanging the code for a token, and
        // finally sending your app's own JWT back to the UI.
    };

    // helper function to set the final state
    // This function would be called by the listener that receives the
    // token from the Electron main process.
    const setSuccessfulLogin = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        setIsLoggedIn(true);
        // localStorage.setItem('authToken', authToken);
        setIsAuthLoading(false);
    };
    const handleLogout = () => {
        // localStorage.removeItem('authToken')
        setIsLoggedIn(false);
        setToken(null);
        setUser(null);
    };

    //hook to keep the state of the app for 
    useEffect(() => {
        // const storedToken = localStorage.getItem('authToken');
        // if (storedToken) { ... logic to log in ... }
        setIsAuthLoading(false); // Done checking
    }, []);


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



    return({
        isLoggedIn,
        user,
        token,
        isAuthLoading,
        loginError,
        handleLogout,
        updateUsername,
        loginWithProvider,
        setSuccessfulLogin,
        isUsernameUpdating,
        usernameError,
        usernameSuccess


    });
}