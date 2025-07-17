

import React from "react";


function FormGroup({
    label,
    htmlFor,
    children,
    className = ''
}) {
    return (
        <div className={`form-group ${className}`}>
            <label htmlFor={htmlFor}>{label}</label>
            {children}
        </div>
    );
}

export default FormGroup;