import path from 'path';
import fs from 'fs/promises';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadScripts() {
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

export async function executeScript(event, {scriptPath, executableName, args}){
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

}

async function getExecutables(folderPath){
    const files = await fs.readdir(folderPath);
    let executables = [];
    for(const file of files){
        const filePath = path.join(folderPath,file);
        if(file.includes('.exe') || file.includes('.sh') || file.includes('.bat') || file.includes('.dmg')){
            executables.push({name: file, path: filePath});
        }
    }
    return executables;
}

export async function getExecutablesBuffer(folderPath){
    const executables = await getExecutables(folderPath);
    let executablesObjctArray = [];
    for(const exe of executables){
        const name = exe.name;
        const filePath = exe.path;
        try{
            const buffer = await fs.readFile(filePath);
            executablesObjctArray.push({name, buffer});
        }
        catch(err){
            console.error(`Error reading executable ${name}:`, err);
            continue;
        }
    }
    return executablesObjctArray;
}