import { app, BrowserWindow,ipcMain } from 'electron'
import path from 'path';
import fs from 'fs/promises';
import process from 'process';
import { fileURLToPath } from 'url';
//import { stat } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({ 
        width: 800, 
        height: 600, 
        webPreferences: {
            preload:path.join(__dirname,'preload.js')
        }
     });
    win.loadURL('http://localhost:5173');
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
            }

        }
    }
    return scripts;
}

ipcMain.handle('loadScripts', async () => {
    const scripts = await loadScripts();
    return scripts;
});

