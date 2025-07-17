import React from "react";
import Button from '../common/Button';
import CategoryBadge from '../common/CategoryBadge';
import NewBadge from '../common/NewBadge';


function ScriptCard({
    title,
    description,
    category,
    isNew = false,
    onViewClick
}) {
    return (
        <article className="script-card">
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="card-footer">
                <CategoryBadge category={category} />
                <Button onClick={onViewClick}>View</Button>
            </div>
            {isNew && <NewBadge />}
        </article>
    );
}

export default ScriptCard;