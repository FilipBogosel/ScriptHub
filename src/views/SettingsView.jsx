import React, { useState } from "react";
import FormGroup from "../components/forms/FormGroup";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

//user -> the user object containing user settings(username, email, etc.)
//The structure for the settings view is:
// -Show title and description
// -Display the current user name and email and a logout button
// -Form to reset password
// -Form to update username
// -An important section that tells the users about "my scripts" and how to manage them
function SettingsView({
    user,
    isLoggedIn,
    onLogout,
    onLogin,
    onUpdateUsername,
    onResetPassword,
    isPasswordReseting = false,
    isUsernameUpdating = false,
    passwordError = '',
    usernameError = '',
    usernameSuccess = '',
    passwordSuccess = '',
}) {

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');

    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters long!");
            return;
        }

        //send the submit info to the parent funtion

        onResetPassword({ currentPassword, newPassword });

        //Reset the inputs
        setConfirmPassword('');
        setNewPassword('');
        setCurrentPassword('');

    }

    const handleUsernameSubmit = (e) => {
        e.preventDefault();

        if (newUsername.length < 4){
            alert("Username too short! I must be at least 4 characters long.");
            return;
        }


        //send the new username to the parent funtion and execute it
        onUpdateUsername(newUsername);

        //clear the username input

        setNewUsername('');
    
    }


    return (
        <section className="settings-view view-section" id="settings-view" >
            <h2>Settings</h2>
            <p>Your settings and important information.</p>
            {
                isLoggedIn ? (
                    <>
                        <h3>Account Information</h3>
                        <p>Username: {user.username}</p>
                        <p>Email: {user.email}</p>
                        <Button onClick={onLogout} className="logout-button">Logout</Button>
                    </>
                ) : (
                    <Button onClick={onLogin} className="login-button">Login</Button>
                )
            }
            {isLoggedIn && (
                <form className="reset-update" onSubmit={handlePasswordSubmit}>
                    <h3>Reset your password</h3>
                    <FormGroup label="Current Password" htmlFor="current-password">
                        <Input
                            type="password"
                            id="current-password"
                            placeholder="Enter current password"
                            disabled={isPasswordReseting || isUsernameUpdating}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup label="New Password" htmlFor="new-password">
                        <Input
                            type="password"
                            id="new-password"
                            placeholder="Enter new password"
                            disabled={isPasswordReseting}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required

                        />
                    </FormGroup>
                    <FormGroup label="Confirm Password" htmlFor="confirm-password">
                        <Input
                            type="password"
                            id="confirm-password"
                            placeholder="Enter new password again"
                            disabled={isPasswordReseting}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            />
                    </FormGroup>
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (<p className="error-message">Passwords do not match!</p>)}
                    {passwordError && (<p className="error-message">{passwordError}</p>)}
                    {passwordSuccess && (<p className="success-message">{passwordSuccess}</p>)}
                    <Button
                        disabled={isPasswordReseting}
                        className="update-button"
                        type="submit">
                        {isPasswordReseting ? "Password is resetting..." : "Reset Password"}
                    </Button>
                </form>
            )
            }

            {isLoggedIn && (
                <form className="reset-update" onSubmit={handleUsernameSubmit}>
                    <h3>Update your usename</h3>
                    <FormGroup
                        label="New Username" htmlFor="new-username">
                        <Input required
                            id="new-username"
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            disabled={isUsernameUpdating}
                            placeholder="Enter new username..."
                        />
                    </FormGroup>

                    {usernameError && (<p className="error-message">{usernameError}</p>)}
                    {usernameSuccess && (<p className="success-message">{usernameSuccess}</p>)}

                    <Button
                        type="submit"
                        className="update-button"
                        disabled={isUsernameUpdating}
                    >
                        {isUsernameUpdating ? "Username is updating..." : "Update Username"}
                    </Button>
                </form>
            )}




        </section>
    );
}

export default SettingsView