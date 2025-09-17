import { BrowserWindow } from "electron";


export async function startLogin(event, provider){
    const serverUrl = 'https://scripthub-server-c0a43f13db60.herokuapp.com';
    const authUrl = `${serverUrl}/api/auth/${provider}`;

    const mainWindow = BrowserWindow.getAllWindows()[0];
    const session = mainWindow.webContents.session;

    // Debug cookies before auth
    const cookiesBefore = await session.cookies.get({});
    console.log('Cookies before auth:', cookiesBefore);

    const authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: false, // Disable web security for cross-origin requests
            session: session
        },
        title: "Login",
    });

    authWindow.loadURL(authUrl);
    const { webContents } = authWindow;
    // In your did-finish-load event handler, modify the authentication success detection:

    webContents.on('did-finish-load', async () => {
        const pageContents = await webContents.executeJavaScript('document.body.textContent');
        const currentUrl = authWindow.webContents.getURL();
        console.log('Page contents:', pageContents);
        console.log('Current URL:', currentUrl);

        // More robust success detection
        if (pageContents && pageContents.includes('authentication successful')) {
            console.log('Auth success detected, waiting for cookies to be set...');

            // Debug cookies after auth
            const cookies = await session.cookies.get({});
            console.log('Cookies after auth:', cookies);

            // Improve cookie handling
            for (const cookie of cookies) {
                if (cookie.name === 'connect.sid') {
                    console.log('Preserving session cookie:', cookie.name);
                    try {
                        // Always set connect.sid with Secure flag when using SameSite=None
                        await session.cookies.set({
                            url: serverUrl,
                            name: cookie.name,
                            value: cookie.value,
                            domain: cookie.domain,
                            path: cookie.path || '/',
                            secure: true, // Must be secure when SameSite=None
                            httpOnly: cookie.httpOnly,
                            sameSite: 'no_restriction',
                            expirationDate: cookie.expirationDate
                        });
                    } catch (err) {
                        console.error(`Error setting cookie ${cookie.name}:`, err);
                    }
                }
            }

            // Wait before closing to ensure cookies are set
            console.log('Waiting before closing auth window...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Sending login-flow-complete event');
            mainWindow.webContents.send('login-flow-complete');

            console.log('Closing auth window...');
            authWindow.close();
        }
    });

}


export async function clearAuthCookies(){
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if(!mainWindow){
        console.error("Main window not found, cannot clear cookies!");
        return;
    }

    const session = mainWindow.webContents.session;
    const domains = ['scripthub-server-c0a43f13db60.herokuapp.com', '.scripthub-server-c0a43f13db60.herokuapp.com', 'localhost', '.localhost', 'github.com', '.github.com', 'google.com', '.google.com', 'accounts.google.com', '.accounts.google.com', 'githubusercontent.com', '.githubusercontent.com'];

    try {
        // Get all cookies for your server domain
        for (const domain of domains) {
            const cookies = await session.cookies.get({ domain });
            for (const cookie of cookies) {
                console.log(`Removing cookie: ${cookie.name} from domain: ${domain}`);
                await session.cookies.remove(`http${cookie.secure ? 's' : ''}://${domain}${cookie.path}`, cookie.name);
            }
        }
        console.log('All authentication cookies cleared successfully');
    }
    catch(error){
        console.error('Failed to clear auth cookie', error.message);
    }

}