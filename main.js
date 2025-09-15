import { app, BrowserWindow,ipcMain, dialog } from 'electron'
import path from 'path';
import fs from 'fs/promises';
import process from 'process';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({ 
        width: 800, 
        height: 600, 
        webPreferences: {
            preload:path.join(__dirname,'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        title: "ScriptHub",
        icon: path.join(__dirname, 'public', 'icon.png')

     });
    win.loadURL('http://localhost:5173');//to be changed to loadFile in production
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


async function loadScripts() {
    const scriptsPath = path.join(__dirname, 'scripts');
    let scriptFolders;
    try{
        scriptFolders = await fs.readdir(scriptsPath);
    }
    catch(error){
        console.error("Error reading scripts directory:", error);
        return [];
    }
    
    let scripts = {
        official:[],
        my:[],
        community:[]
    }

    for (const folderName of scriptFolders) {
        const folderPath = path.join(scriptsPath, folderName);
        const stats = await fs.stat(folderPath);
        if (stats.isDirectory()) {
            const metadataFilePath = path.join(folderPath, 'metadata.json');
            try {
                const metadataContent = await fs.readFile(metadataFilePath, "utf-8");
                const metadata = JSON.parse(metadataContent);

                const scriptType = metadata.type || 'my';

                const scriptInfo = {
                    ...metadata, 
                    folderPath: folderPath,
                    folderName: folderName,
                    type:scriptType,
                }
                if(scripts[scriptType]){
                    scripts[scriptType].push(scriptInfo);
                }
                else{
                    scripts.my.push(scriptInfo);
                }
            }
            catch (error) {
                console.error(`Error reading metadata for ${folderName}:`, error);
                continue;
            }

        }
    }
    return scripts;
}

ipcMain.handle('loadScripts', async () => {
    const scripts = await loadScripts();
    return scripts;
});

ipcMain.handle('executeScript', async (event, {scriptPath, executableName, args}) => {
    const executablePath = path.join(scriptPath,executableName);
    const child = spawn(executablePath,args);

    child.stdout.on('data', (data)=>{
        event.sender.send('script-output', data.toString());
    });

    child.stderr.on('data', (data)=>{
        event.sender.send('script-output', data.toString());
    });

    child.on('close', (code)=>{
        event.sender.send('script-output', `\n--- Script finished with code ${code} ---`);
    });

});

ipcMain.handle('getRootFolder', () => {
    return path.join(__dirname, 'scripts');
});

ipcMain.handle('browseFile', async (event, options) => {
    try{
        const res = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), options);
        return res;
    }
    catch(err){
        console.error(err);
        throw err;
    }
});


ipcMain.handle('startLogin', async (event, provider)=>{
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
    const {webContents} = authWindow;
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

});





