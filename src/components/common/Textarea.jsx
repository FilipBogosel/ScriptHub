
function Textarea({
    value,
    name = "",
    id,
    rows = 3,
    cols = 15,
    placeholder = '',
    onChange,
    className = ''
}) {
        return(
            <textarea 
            name={name} 
            id={id} 
            rows={rows} 
            cols={cols}
            value={value}
            placeholder={placeholder} 
            onChange={onChange}
            className={className}
            ></textarea>
        );
}

export default Textarea