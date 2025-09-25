import path from 'path';
import fs from 'fs/promises';
import { spawn } from 'child_process';
import { BrowserWindow } from 'electron';


export async function loadScripts(__dirname) {
    const scriptsPath = path.join(__dirname, 'scripts');
    let scriptFolders;
    try {
        scriptFolders = await fs.readdir(scriptsPath);
    }
    catch (error) {
        console.error("Error reading scripts directory:", error);
        return [];
    }

    let scripts = {
        official: [],
        my: [],
        community: []
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
                    type: scriptType,
                }
                if (scripts[scriptType]) {
                    scripts[scriptType].push(scriptInfo);
                }
                else {
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

export async function executeScript(event, { scriptPath, executableName, args }) {
    const executablePath = path.join(scriptPath, executableName);
    const child = spawn(executablePath, args);

    child.stdout.on('data', (data) => {
        event.sender.send('script-output', data.toString());
    });

    child.stderr.on('data', (data) => {
        event.sender.send('script-output', data.toString());
    });

    child.on('close', (code) => {
        event.sender.send('script-output', `\n--- Script finished with code ${code} ---`);
    });

}

async function getExecutables(folderPath) {
    const files = await fs.readdir(folderPath);
    let executables = [];
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        if (file.includes('.exe') || file.includes('.sh') || file.includes('.bat') || file.includes('.dmg')) {
            executables.push({ name: file, path: filePath });
        }
    }
    return executables;
}

export async function getExecutablesBuffer(folderPath) {
    const executables = await getExecutables(folderPath);
    let executablesObjctArray = [];
    for (const exe of executables) {
        const name = exe.name;
        const filePath = exe.path;
        try {
            const buffer = await fs.readFile(filePath);
            executablesObjctArray.push({ name, buffer });
        }
        catch (err) {
            console.error(`Error reading executable ${name}:`, err);
            continue;
        }
    }
    return executablesObjctArray;
}


export async function createScriptFolder(event, { scriptFolderPath, script }) {
    try {
        const scriptFolderName = script.name.replace(/[<>:"/\\|?*]/g, '_');//sanitize folder name
        const newFolderPath = path.join(scriptFolderPath, scriptFolderName);

        await fs.mkdir(newFolderPath, { recursive: true });

        const metadata = {
            name: script.name,
            description: script.description,
            longDescription: script.longDescription,
            version: script.version,
            author: script.author?.username || script.author || 'Unknown',
            category: script.category,
            executable: script.executable,
            parameters: script.parameters,
            dependencies: script.dependencies,
            outputExtension: script.outputExtension,
            type: 'community', // Mark it as a downloaded community script
        };

        const stringMetadata = JSON.stringify(metadata);
        await fs.writeFile(path.join(newFolderPath, 'metadata.json'), stringMetadata);

        return newFolderPath;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

export async function downloadAllFilesToFolder(event, { urls, folderPath, scriptName, script }) {
    if (!Array.isArray(urls) || urls.length === 0) {
        throw new Error('No download URLs provided');
    }

    if (!folderPath) {
        throw new Error('Download folder path is required');
    }

    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (!mainWindow) {
        throw new Error('Main window not found');
    }

    const session = mainWindow.webContents.session;

    // Track downloads completion
    let completedDownloads = 0;
    let failedDownloads = 0;
    const totalDownloads = urls.length;

    const downloadHandler = (event, item, webContents) => {
        // Get the S3 filename (with UUID)
        const s3FileName = item.getFilename();

        // Extract original filename by removing UUID prefix
        const originalFileName = s3FileName.replace(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}-/, '');

        // Use the original executable name if available, otherwise use extracted name
        const finalFileName = script?.executable || originalFileName;

        const savePath = path.join(folderPath, finalFileName);
        item.setSavePath(savePath);

        item.on('updated', (event, state) => {
            if (state === 'progressing' && !item.isPaused()) {
                const received = item.getReceivedBytes();
                const total = item.getTotalBytes();
                const progress = Math.round((received / total) * 100);
                webContents.send('download-progress', {
                    progress,
                    fileName: finalFileName,
                    scriptName
                });
            }
        });

        item.once('done', (event, state) => {
            if (state === 'completed') {
                completedDownloads++;
                console.log('Download completed:', savePath);
                webContents.send('download-complete', {
                    fileName: finalFileName,
                    path: savePath,
                    scriptName
                });
            } else {
                failedDownloads++;
                console.log(`Download failed: ${state}`);
                webContents.send('download-failed', {
                    fileName: finalFileName,
                    state,
                    scriptName
                });
            }

            // Check if all downloads are complete
            if (completedDownloads + failedDownloads === totalDownloads) {
                // Clean up listener
                session.removeListener('will-download', downloadHandler);

                // Send completion event
                webContents.send('all-downloads-complete', {
                    scriptName,
                    completed: completedDownloads,
                    failed: failedDownloads,
                    total: totalDownloads
                });
            }
        });
    }
    session.on('will-download', downloadHandler);

    return new Promise((resolve, reject) => {
        const win = BrowserWindow.getAllWindows()[0];
        if (!win) {
            reject(new Error('No browser window available for download'));
            return;
        }

        // Store completion handlers
        const completionHandler = (event, data) => {
            if (data.scriptName === scriptName) {
                if (data.failed === 0) {
                    resolve({
                        success: true,
                        completed: data.completed,
                        total: data.total,
                        folder: folderPath
                    });
                } else {
                    resolve({
                        success: false,
                        completed: data.completed,
                        failed: data.failed,
                        total: data.total,
                        folder: folderPath
                    });
                }
                // Clean up listener
                win.webContents.removeListener('all-downloads-complete', completionHandler);
            }
        };

        // Listen for completion
        win.webContents.on('all-downloads-complete', completionHandler);

        // Handle case where no files to download
        if (urls.length === 0) {
            resolve({
                success: true,
                completed: 0,
                total: 0,
                folder: folderPath
            });
            return;
        }

        // Start downloads
        try {
            for (const url of urls) {
                win.webContents.downloadURL(url);
            }
        } catch (error) {
            console.error('Download error:', error);
            reject(error);
        }
    });

}