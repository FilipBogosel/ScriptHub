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
   }



   });