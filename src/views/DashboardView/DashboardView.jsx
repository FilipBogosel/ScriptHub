import Toolbar from "../../components/script/Toolbar";
import ScriptSection from "../../components/script/ScriptSection";
import Button from "../../components/common/Button";

//categories must be an array of objects, each containing { value: string, label: string }
function DashboardView({
    scripts=[],
    dashboardFilter='official',
    onSearchChange,
    searchValue='', 
    selectedCategory='all',
    onCategoryChange,
    onScriptView,
    categories,
    viewDatabaseScripts=false,
    onToggleViewDatabaseScripts

}){

    let id,title;
    if(dashboardFilter === "official"){
        id="official-scripts";
        title="Official Scripts";
    }
    else if(dashboardFilter==="my"){
        id="my-scripts";
        title="My Scripts"
    }
    else if(dashboardFilter === "community") {
        id="community-scripts";
        title="Community Scripts"
    }
    else {
        id="official-scripts";
        title="Official Scripts"
    }
    return(
        <section id="dashboard-view" className="view-section">
            <h2 id="dashboard-title">Dashboard</h2>
            <Toolbar 
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                categoryOptions={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}>
            </Toolbar>
            <span>
                {dashboardFilter === 'community' && (
                    <Button className="toggle-db-scripts-button" onClick={onToggleViewDatabaseScripts}>{viewDatabaseScripts ? 'View downloaded Scripts' : 'View all community scripts'}</Button>
                )}
                <ScriptSection
                    id={id}
                    title={title}
                    onScriptView={onScriptView}
                    scripts={scripts}
                >
                </ScriptSection>
            </span>
            {scripts.length === 0 && (
                <p style={{ textAlign: 'center', padding: '2rem'}}>No scripts found.</p>
            )}
        </section>
    );
}

export default DashboardView