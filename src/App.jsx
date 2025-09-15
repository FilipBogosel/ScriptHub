//import React, { useState } from 'react';
import Header from './components/layout/Header';
import SidebarNav from './components/layout/SidebarNav';
import Footer from './components/layout/Footer';
import DashboardView from './views/DashboardView/DashboardView';
import ScriptDetailView from './views/ScriptDetailView/ScriptDetailView';
import SettingsView from './views/SettingsView/SettingsView';
//import { officialMockScripts, myMockScripts, communityMockScripts, categories } from './data/mockData';
import {useAppNavigation} from './hooks/useAppNavigation'
import {useScriptData} from './hooks/useScriptData'
import { useScriptExecution } from './hooks/useScriptExecution';
import { useAuth } from './hooks/useAuth';
import { categories } from './data/mockData';
import { useState,useEffect } from 'react';



function App() {
  const [rootFolder, setRootFolder] = useState('');
  useEffect(() => {
    const fetchRootFolder = async () => {
      try {
        const folder = await window.electronAPI.getRootFolder();
        setRootFolder(folder);
      } catch (error) {
        console.error('Error fetching root folder:', error);
        setRootFolder('Unable to load root folder');
      }
    };

    fetchRootFolder();
  }, []);
  const navigation = useAppNavigation();

  const data = useScriptData();

  const execution = useScriptExecution();

  const auth = useAuth();

  //simple helpers

  const backToDashboard = () =>{
      navigation.handleBackToDashboard();
      execution.resetExecutionState();
  };

  const handleScriptSelect = (script) => {
      navigation.handleScriptView(script);
      execution.initializeFormData(script);
  };

  const getScriptsForCurrentView = () => {
      return(data.getFilteredScripts(navigation.dashboardFilter,navigation.viewAllCommunityScripts));
  };

  if (auth.isAuthLoading) {
    return (
      <>
        <Header/>
        <div className='app-layout'>
          <main className='content-area'>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2>Loading...</h2>
            </div>
          </main>
        </div>
        <Footer/>
      </>
    );
  }

  const renderCurrentView = () => {
    try{
      switch(navigation.currentView){
        case 'dashboard':
          return(
            <DashboardView 
              scripts={getScriptsForCurrentView()}
              dashboardFilter={navigation.dashboardFilter}
              onSearchChange={(e)=> data.setSearchValue(e.target.value)}
              searchValue={data.searchValue}
              selectedCategory={data.selectedCategory}
              onCategoryChange={(e)=>data.setSelectedCategory(e.target.value)}
              onScriptView={handleScriptSelect}
              categories={categories}
              viewDatabaseScripts={navigation.viewAllCommunityScripts}
              onToggleViewDatabaseScripts={navigation.toggleViewAllCommunityScripts}
            />
          );
        case 'script-detail':
          if (!navigation.selectedScript) {
            return (
              <div className="error-view">
                <h2>Script not found</h2>
                <button onClick={backToDashboard}>Back to Dashboard</button>
              </div>
            );
          }
          return(
            <ScriptDetailView 
              onBack={backToDashboard}
              script={navigation.selectedScript}
              scriptType={navigation.dashboardFilter}
              isRunning={execution.isRunning}
              isDownloading={execution.isDownloading}
              isUploading={execution.isUploading}
              onRun={execution.handleRunScript}
              onDownload={execution.handleDownloadScript}
              onUpload={execution.handleUploadScript}
              onBrowse={execution.handleBrowseFile}
              output={execution.output}
              executionError={execution.executionError}
              formData={execution.formData}
              onFormChange={execution.handleFormChange}
              viewDatabaseScripts={navigation.viewAllCommunityScripts}
            />
          );
        case 'settings':
          return(
            <SettingsView
              user={auth.user}
              isLoggedIn={auth.isLoggedIn}
              onLogin={auth.loginWithProvider}
              onLogout={auth.handleLogout}
              onUpdateUsername={auth.updateUsername}
              isUsernameUpdating={auth.isUsernameUpdating}
              usernameError={auth.usernameError}
              usernameSuccess={auth.usernameSuccess}
              rootFolder={rootFolder}
            />
          );
        default:
          return(
            <DashboardView 
              scripts={getScriptsForCurrentView()}
              dashboardFilter={navigation.dashboardFilter}
              onSearchChange={(e)=> data.setSearchValue(e.target.value)}
              searchValue={data.searchValue}
              selectedCategory={data.selectedCategory}
              onCategoryChange={(e)=>data.setSelectedCategory(e.target.value)}
              onScriptView={handleScriptSelect}
              categories={categories}
            />
          );
      }
    }
    
    catch (error) {
      console.error("Error rendering current view:", error);
    return (
      <div className="error-view">
        <h2>Something went wrong</h2>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  };

  return (
    <>
      <Header/>
      <div className='app-layout'>
          <SidebarNav 
            dashboardFilter={navigation.dashboardFilter}
            activeView={navigation.currentView}
            onViewChange={navigation.handleNavigation}
          />

          <main className='content-area'>
              {renderCurrentView()}
          </main>

      </div>
      <Footer/>
    </>
  );
}

export default App;
