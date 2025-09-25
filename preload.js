// eslint-disable-next-line no-undef
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', 
   {
      loadScripts: () => ipcRenderer.invoke('loadScripts'),

   executeScript: (args) => ipcRenderer.invoke('executeScript', args),

   onScriptOutput: (callback) => {
      const subscription = (_event, value) => callback(value);
      ipcRenderer.on('script-output', subscription);

      return () => ipcRenderer.removeListener('script-output',subscription);
   },
   getRootFolder: () => ipcRenderer.invoke('getRootFolder'),

   browseFile: (options) => ipcRenderer.invoke('browseFile',options),

   startLogin: (provider) => ipcRenderer.invoke('startLogin', provider),

   onLoginFlowComplete: (callback) => {
      const subscription = () => callback();
      ipcRenderer.on('login-flow-complete', subscription);
      return () => ipcRenderer.removeListener('login-flow-complete',subscription);
   },

   getExecutables: (folderPath) => ipcRenderer.invoke('getExecutables', folderPath),//returns objects{name,buffer} 

   clearAuthCookies: () => ipcRenderer.invoke('clearAuthCookies'),

   createScriptFolder: (options)=> ipcRenderer.invoke('createScriptFolder', options),

      downloadAllFilesToFolder: (options) => ipcRenderer.invoke('downloadAllFilesToFolder', options),

      onDownloadProgress: (callback) => {
         const subscription = (_event, data) => callback(data);
         ipcRenderer.on('download-progress', subscription);
         return () => ipcRenderer.removeListener('download-progress', subscription);
      },

      onDownloadComplete: (callback) => {
         const subscription = (_event, data) => callback(data);
         ipcRenderer.on('download-complete', subscription);
         return () => ipcRenderer.removeListener('download-complete', subscription);
      },

      onDownloadFailed: (callback) => {
         const subscription = (_event, data) => callback(data);
         ipcRenderer.on('download-failed', subscription);
         return () => ipcRenderer.removeListener('download-failed', subscription);
      },

      onAllDownloadsComplete: (callback) => {
         const subscription = (_event, data) => callback(data); // <- Add data parameter
         ipcRenderer.on('all-downloads-complete', subscription);
         return () => ipcRenderer.removeListener('all-downloads-complete', subscription);
      }




   });