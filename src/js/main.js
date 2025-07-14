// ============= Show Views =============

const navLinks = document.querySelectorAll(".sidebar-nav a");

const viewSections = document.querySelectorAll(".view-section");

function showView(viewId) {
    viewSections.forEach(view => {
        if (view.id === viewId) {
            view.style.display = "block";
            if(viewId === "settings-view"){
                document.getElementById("script-detail-view").style.display = "none";
            }
            else{
                document.getElementById("script-detail-view").style.display = "block";
            }
        }
        else {
            view.style.display = "none";
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener("click", (event)=>{
        event.preventDefault();
        const targetId = link.getAttribute("href").slice(1);
        navLinks.forEach(link2 => {
            link2.classList.remove("active-link");
        });
        link.classList.add("active-link");
        showView(targetId);
    });

    
});

showView("official-scripts");

// =========== Show active nav page ============

