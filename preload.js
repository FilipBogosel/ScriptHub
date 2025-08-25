const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {loadScripts: () => ipcRenderer.invoke('loadScripts')});