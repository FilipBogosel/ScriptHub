import { contextBridge, ipcRenderer } from "electron";

contextBridge.executeInMainWorld('electronAPI', {loadScripts: () => ipcRenderer.invoke('loadScripts')});