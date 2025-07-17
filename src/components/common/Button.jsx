import React from "react";

//children -> the content inside the button, might be text or icons
//onClick -> function to call when the button is clicked
//type -> the type of button, default is 'button', can be 'submit' or 'reset'
//className -> additional CSS classes for styling
//variant -> defines the button style, e.g., 'run' for a special run button
function Button({ children,
    onClick,
    type = 'button',
    className = '',
    variant = 'default' }) {
    const baseClass = 'button';
    const variantClass = variant === 'run' ? 'run-button' : '';
    const fullClassName = `${baseClass} ${variantClass} ${className}`.trim();

    return (
        <button className={fullClassName} type={type} onClick={onClick}>{children}</button>
    );
}

export default Button