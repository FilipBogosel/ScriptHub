

function SidebarNav({
    dashboardFilter,
    activeView,
    onViewChange,
    navItems = [
        { id: 'dashboard', filter: 'official', label: 'Official Scripts' },
        { id: 'dashboard', filter: 'my', label: 'My Scripts' },
        { id: 'dashboard', filter: 'community', label: 'Community Scripts' },
        { id: 'settings', filter: null, label: 'Settings' }
    ]
}) {
    return (
        <nav className="sidebar-nav">
            <ul>
                {
                    navItems.map(item => {
                        const isActive = (activeView === item.id && (item.filter === null || dashboardFilter === item.filter))
                        return (
                            <li key={`${item.id}-${item.filter || 'no-filter'}`}>
                                <a
                                    href={`#${item.id}`}
                                    className={isActive ? "active-link" : ""}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onViewChange(item.id, item.filter);
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