import Toolbar from "../../components/script/Toolbar";
import ScriptSection from "../../components/script/ScriptSection";

//categories must be an array of objects, each containing { value: string, label: string }
function DashboardView({
    scripts=[],
    currentView='official',
    onSearchChange,
    searchValue='', 
    selectedCategory='all',
    onCategoryChange,
    onScriptView,
    categories

}){

    let id,title;
    if(currentView === "official"){
        id="official-scripts";
        title="Official Scripts";
    }
    else if(currentView==="my"){
        id="my-scripts";
        title="My Scripts"
    }
    else if(currentView === "community") {
        id="community-scripts";
        title="Community Scripts"
    }
    else {
        id="official-scripts";
        title="Official Scripts"
    }
    return(
        <section id="dashboard-view">
            <h2 id="dashboard-title">Dashboard</h2>
            <Toolbar 
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                categoryOptions={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}>
            </Toolbar>

            <ScriptSection
                id={id}
                title={title}
                onScriptView={onScriptView}
                scripts={scripts}
            >

            </ScriptSection>
        </section>
    );
}

export default DashboardView