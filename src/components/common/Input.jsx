import React from "react";



function Input({ type = 'text', placeholder = '', value, onChange, name, id, required = false, className = '' }) {

    return(
        <input type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        name={name} 
        id={id}
        required={required}
        className={className} />
    );

}

export default Input