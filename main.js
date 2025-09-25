import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { clearAuthCookies, startLogin } from './src/utils/authUtils.js';
import { loadScripts, executeScript, getExecutablesBuffer, createScriptFolder, downloadAllFilesToFolder } from './src/utils/scriptUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        title: "ScriptHub",
        icon: path.join(__dirname, 'public', 'icon.png')

    });
    win.loadURL('http://localhost:5173');//to be changed to loadFile in production
}

app.whenReady().then(() => {
    createWindow();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});




ipcMain.handle('loadScripts', async () => {
    const scripts = await loadScripts(__dirname);
    return scripts;
});
ipcMain.handle('executeScript', (event, scriptDetails) => executeScript(event, scriptDetails));

ipcMain.handle('getRootFolder', () => {
    return path.join(__dirname, 'scripts');
});

ipcMain.handle('browseFile', async (event, options) => {
    try {
        const res = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), options);
        return res;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});

ipcMain.handle('startLogin', (event, provider) => startLogin(event, provider));

ipcMain.handle('getExecutables', async (event, folderPath) => {
    try {
        return await getExecutablesBuffer(folderPath);
    } catch (error) {
        console.error('Error in getExecutables handler:', error);
        throw error;
    }
});

ipcMain.handle('clearAuthCookies', clearAuthCookies);

ipcMain.handle('createScriptFolder', (event, options) => createScriptFolder(event, options));

ipcMain.handle('downloadAllFilesToFolder', async (event, options) => {
    try {
        const result = await downloadAllFilesToFolder(event, options);
        return result;
    } catch (error) {
        console.error('Download error in IPC handler:', error);
        throw error;
    }
});



