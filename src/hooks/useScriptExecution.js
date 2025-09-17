import React, { useState, useEffect, useCallback } from "react";
import api from '../services/api';

export function useScriptExecution() {
    const [isRunning, setIsRunning] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({});

    const [output, setOutput] = useState('Awaiting execution...');
    const [executionError, setExecutionError] = useState('');

    useEffect(() => {
        const removeListener = window.electronAPI.onScriptOutput((data) => {
            setOutput(prev => prev + data);
            if (data.includes('--- Script finished')) {
                setIsRunning(false);
            }
        });
        return () => removeListener();
    }, []);

    //function to initialize the parameters form in detail view
    const initializeFormData = (script) => {
        const initialData = {};
        script.parameters?.forEach(param => {
            initialData[param.name] = param.defaultValue !== undefined ? param.defaultValue : '';
        });
        setFormData(initialData);
    };

    //handle input changes in the form
    const handleFormChange = (fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleRunScript = useCallback(async (formData, script) => {
        setIsRunning(true);
        setExecutionError('');
        setOutput('Starting script execution...');

        const paramsArray = script.parameters.map(p => formData[p.name] || '');


        try {
            await window.electronAPI.executeScript({
                scriptPath: script.folderPath,
                executableName: script.executable,
                args: paramsArray
            });
            initializeFormData(script); //reset form data after execution
        }
        catch (error) {
            setExecutionError(`❌ Error executing script: ${error.message}`);
            setOutput("Error occured!!!");
            setIsRunning(false);
        }


    }, []);

    const handleDownloadScript = async (script) => {
        setIsDownloading(true);
        setExecutionError('');
        setOutput('Starting script download...');

        try {
            //mock/test implementation - to be replaced 
            await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate script download delay
            setOutput(`"${script.name}" downloaded successfully!`);
        }
        catch (error) {
            setExecutionError(`❌ Error downloading script: ${error.message}`);
            setOutput("Download failed!");
        }
        finally { setIsDownloading(false); }
    };

    const handleUploadScript = async (script, user) => {
        setIsUploading(true);
        setExecutionError('');
        setOutput('Starting script uploading...');

        try {
            const executables = await window.electronAPI.getExecutables(script.folderPath);

            if (!executables || executables.length === 0) {
                throw new Error('No executable files found');
            }

            const scriptData = new FormData();

            scriptData.append('name', script.name);
            scriptData.append('description', script.description || '');
            scriptData.append('longDescription', script.longDescription || '');
            scriptData.append('version', script.version || '1.0.0');
            scriptData.append('category', script.category || 'media');
            scriptData.append('type', 'community');
            scriptData.append('tags', JSON.stringify(script.tags || []));
            console.log('User: ', user);
            scriptData.append('author', user._id || user.id);
            scriptData.append('parameters', JSON.stringify(script.parameters || []));
            scriptData.append('executable', script.executable || '');
            scriptData.append('outputExtension', script.outputExtension || '');

            let fileAdded = false;
            for(const exe of executables){
                if(!exe.buffer || exe.buffer.byteLength === 0){
                    console.warn(`Skipping empty file: ${exe.name}`);
                    continue;
                }
                console.log('Buffer:', exe.buffer);
                console.log(`Adding file: ${exe.name}, size: ${exe.buffer.byteLength} bytes`);
                const blob = new Blob([exe.buffer], { type: 'application/octet-stream' });

                scriptData.append('scriptFiles', blob, exe.name);   
                fileAdded = true;
            }
            if (!fileAdded) {
                throw new Error('Failed to add any files to upload. Check file data.');
            }

            console.log('Files to upload:', scriptData.getAll('scriptFiles').map(f =>
                `${f.name} (${f.size} bytes, type: ${f.type})`
            ));

            console.log('Starting the post request to upload script...');
            console.log('Script data to be sent:', {
                name: scriptData.get('name'),
                description: scriptData.get('description'),
                longDescription: scriptData.get('longDescription'),
                version: scriptData.get('version'),
                category: scriptData.get('category'),
                type: scriptData.get('type'),
                executable: scriptData.get('executable'),
                outputExtension: scriptData.get('outputExtension'),
                parameters: scriptData.get('parameters'),
                author: scriptData.get('author'),
                tags: scriptData.get('tags'),
                files: scriptData.getAll('scriptFiles').map(f => f.name)
            });

            const response = await api.post('/api/scripts', scriptData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setOutput(`Uploading... ${percentCompleted}%`);
                }
            });

            setOutput(`✅ "${script.name}" uploaded successfully!`);
            console.log('Upload response:', response.data);

        } catch (error) {
        console.error('Upload error:', error);
        console.error('Server response:', error.response?.data); // Add this line
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        setExecutionError(`❌ Error uploading script: ${errorMessage}`);
        setOutput("Upload failed!");
    } 
         finally {
            setIsUploading(false);
        }
    };

    const handleBrowseFile = async (fieldName) => {
        try {
            const dialogOptions = {
                title: 'Select File or Folder',
                properties: ['openFile', 'openDirectory'],
            };
            if (fieldName.toLowerCase().includes('folder')) {
                dialogOptions.properties = ['openDirectory'];
                dialogOptions.title = 'Select Folder';
            }
            if (fieldName.toLowerCase().includes('file')) {
                dialogOptions.properties = ['openFile'];
                dialogOptions.title = 'Select File';
            }
            const result = await window.electronAPI.browseFile(dialogOptions);
            if (!result.canceled && result.filePaths.length > 0) {
                const selectedPath = result.filePaths[0];
                handleFormChange(fieldName, selectedPath);
            }

        }
        catch (error) {
            console.error(error);
            setExecutionError(`❌ Error browsing files: ${error.message}`);
        }


    };

    const resetExecutionState = () => {
        setFormData({});
        setIsRunning(false);
        setIsDownloading(false);
        setIsUploading(false);
        setOutput("Awaiting execution...");
        setExecutionError('');
    };


    return ({
        isRunning,
        isUploading,
        isDownloading,
        formData,
        output,
        executionError,
        initializeFormData,
        resetExecutionState,
        handleBrowseFile,
        handleRunScript,
        handleDownloadScript,
        handleUploadScript,
        handleFormChange
    });

}