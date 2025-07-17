

function SidebarNav({
    activeView,
    onViewChange,
    navItems = [
        { id: 'official-scripts', label: 'Official Scripts' },
        { id: 'my-scripts', label: 'My Scripts' },
        { id: 'comunity-scripts', label: 'Community Scripts' },
        { id: 'settings-view', label: 'Settings' }
    ]
}){
    return(
        <nav className="sidebar-nav">
            <ul>
                {
                    navItems.map(item => {
                        return(
                            <li key={item.id}>
                                <a 
                                    href={`#${item.id}`} 
                                    className={activeView===item.id ? "active-link":""}
                                    onClick={(e)=>{
                                        e.preventDefault();
                                        onViewChange(item.id);
                                    }}
                                >{item.label}</a>
                            </li>
                        );
                    })
                }
            </ul>
        </nav>
    );
}

export default SidebarNav