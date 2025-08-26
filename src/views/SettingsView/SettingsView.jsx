import React, { useState } from "react";
import FormGroup from "../../components/forms/FormGroup";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

//user -> the user object containing user settings(username, email, etc.)
//The structure for the settings view is:
// -Show title and description
// -Display the current user name and email and a logout button
// -Form to update username
// -An important section that tells the users about "my scripts" and how to manage them
function SettingsView({
    user,
    isLoggedIn,
    onLogout,
    onLogin,
    onUpdateUsername,
    isUsernameUpdating = false,
    usernameError = '',
    usernameSuccess = '',
    rootFolder = '',
}) {

    const [newUsername, setNewUsername] = useState('');

    const handleUsernameSubmit = (e) => {
        e.preventDefault();

        if (newUsername.length < 4) {
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
            <div className="settings-header">
                <h2>Settings</h2>
                <p>Your settings and important information.</p>
            </div>
            
            {
                isLoggedIn ? (
                    <div className="account-info-card">
                        <h3>Account Information</h3>
                        <div className="account-info-details">
                            <div className="account-info-item">
                                <span className="account-info-label">Username:</span>
                                <span className="account-info-value">{user.username}</span>
                            </div>
                            <div className="account-info-item">
                                <span className="account-info-label">Email:</span>
                                <span className="account-info-value">{user.email}</span>
                            </div>
                        </div>
                        <Button onClick={onLogout} className="logout-button">Logout</Button>
                    </div>
                ) : (
                    <Button onClick={onLogin} className="login-button">Login</Button>
                )
            }
            {isLoggedIn && (
                <form className="reset-update" onSubmit={handleUsernameSubmit}>
                    <h3>Update your username</h3>
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

            <div className="about-my-scripts">
                <h3>About My Scripts Feature</h3>
                <p>You can add a new script of your on making if you create a folder in which you include the Python script, an executable named script.exe and a metadata.json file. Then you should copy that folder in the "scripts" folder in the root of the project : {`${rootFolder}`}. After that, you can see your script in the "My Scripts" section of the app.</p>
            </div>



        </section>

    );
}

export default SettingsView