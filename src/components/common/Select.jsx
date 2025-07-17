import React from "react";


//parameter options is an array objects with value and label properties for the elements of the select
//example: [{value: 'option1', label: 'Option 1'}, {value: 'option2', label: 'Option 2'}]
function Select({
        name='',
        id,
        options, 
        value, 
        className='',
        onChange}){
    return(
        <select name={name} 
        id={id} 
        value={value}
        className={className} 
        onChange={onChange} >
            {
                options.map((option)=>{
                    return (
                    <option value={option.value} 
                    key={option.value}>
                    {option.label}
                    </option>);
                })
            }
        </select>
    );
}

export default Select;