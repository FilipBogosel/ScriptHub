import React, { useState, useEffect, useCallback } from "react";

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
            initialData[param.name] = '';
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

        const paramsArray = script.parameters.map(p=>formData[p.name]||'');


        try{
            await window.electronAPI.executeScript({
                scriptPath: script.folderPath,
                executableName: script.executable,
                args: paramsArray
            });
            initializeFormData(script); //reset form data after execution
        }
        catch(error){
            setExecutionError(`❌ Error executing script: ${error.message}`);
            setOutput("Error occured!!!");
            setIsRunning(false);
        }
        



        

    },[]);

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

    const handleUploadScript = async (script) => {
        setIsUploading(true);
        setExecutionError('');
        setOutput('Starting script uploading...');

        try {
            //mock/test implementation - to be replaced 
            await new Promise(resolve => setTimeout(resolve, 3500)); // Simulate script execution delay
            setOutput(`Script "${script.name}" uploaded successfully!`);
        }
        catch (error) {
            setExecutionError(`❌ Error uploading script: ${error.message}`);
            setOutput("Upload failed!");
        }
        finally { setIsUploading(false); }
    };

    const handleBrowseFile = async (fieldName) => {
        try{
            const dialogOptions = {
                title:'Select File or Folder',
                properties: ['openFile', 'openDirectory'],
            };
            if(fieldName.toLowerCase().includes('folder')){
                dialogOptions.properties = ['openDirectory'];
                dialogOptions.title = 'Select Folder';
            }
            if(fieldName.toLowerCase().includes('file')){
                dialogOptions.properties = ['openFile'];
                dialogOptions.title = 'Select File';    
            }
            const result = await window.electronAPI.browseFile(dialogOptions);
            if(!result.canceled && result.filePaths.length>0){
                const selectedPath = result.filePaths[0];
                handleFormChange(fieldName, selectedPath);
            }
            
        }
        catch(error){
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