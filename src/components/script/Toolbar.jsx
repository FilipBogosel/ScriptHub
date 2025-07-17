import React from "react";
import Input from '../common/Input';
import Select from '../common/Select';

function Toolbar({
    searchValue,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categoryOptions
}) {
    return (
        <div className='toolbar'>
            <Input
                type='search'
                value={searchValue}
                placeholder='Search scripts...'
                className='search-bar'
                onChange={onSearchChange}
            />
            <Select
                id='categories'
                name='categories'
                onChange={onCategoryChange}
                value={selectedCategory}
                options={categoryOptions}
            />
        </div>
    );
}

export default Toolbar;