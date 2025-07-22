import React, { useState } from 'react';
import Header from './components/layout/Header';
import SidebarNav from './components/layout/SidebarNav';
import Footer from './components/layout/Footer';
import DashboardView from './views/DashboardView/DasboardView';
import ScriptDetailView from './views/ScriptDetailView/ScriptDetailView';
import SettingsView from './views/SettingsView/SettingsView';
import { officialMockScripts, myMockScripts, communityMockScripts, categories } from './data/mockData';
import {useAppNavigation} from './hooks/useAppNavigation'
import {useScriptData} from './hooks/useScriptData'
import { useScriptExecution } from './hooks/useScriptExecution';
function App() {
  

  return (
    <>
      

      
    </>
  );
}

export default App;
