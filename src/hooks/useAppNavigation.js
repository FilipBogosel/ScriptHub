import React, { useState } from "react";

//Hook to manage application navigation state
//It returns the state and handlers for SidebarNav, DashboardView, and ScriptDetailView

export function useAppNavigation() {
    const [currentView, setCurrentView] = useState('dashboard');

    const [dashboardFilter, setDashboardFilter] = useState('official');

    const [selectedScript, setSelectedScript] = useState(null);

    //handle the navigation bar
    const handleNavigation = (viewId,filter) => {
        if(viewId==='dashboard'&&filter){
            setCurrentView('dashboard');
            setDashboardFilter(filter);
        }
        else if(viewId==='settings'){
            setCurrentView('settings');
        }
        else if(viewId==='script-detail'){
            setCurrentView('script-detail');
        }
        
        if(viewId!=='script-detail'){
            setSelectedScript(null);
        }
    };

    const handleScriptView = (script) => {
        setCurrentView('script-detail');
        setSelectedScript(script);
    };

    const handleBackToDashboard = () => {
        setCurrentView('dashboard');
        setSelectedScript(null);
    };

    return {
        currentView,
        dashboardFilter,
        selectedScript,
        handleNavigation,
        handleScriptView,
        handleBackToDashboard
    };


}