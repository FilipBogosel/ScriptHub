
import React from "react";
import ScriptCard from "./ScriptCard";


function ScriptSection({
    id,
    title,
    scripts,
    onScriptView,
    className = ''
}) {
    return (
        <section className={`view-section ${className}`} id={id}>
            <h3>{title}</h3>
            <div className="script-list">
                {scripts.map(script => (
                     <ScriptCard
                        key={script.id}
                        title={script.title}
                        description={script.description}
                        category={script.category}
                        isNew={script.isNew}
                        onViewClick={() => onScriptView(script)}
                    />
                ))}
            </div>
        </section>
    );
}

export default ScriptSection;