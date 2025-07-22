import React, { useState } from "react";
import { officialMockScripts, myMockScripts, communityMockScripts } from "../data/mockData";
import Fuse from "fuse.js";

//handles data and filtering logic
//to be extended to take data from an API
export function useScriptData() {

    const [scripts] = useState({
        official: officialMockScripts,
        my: myMockScripts,
        community: communityMockScripts
    });

    const [searchValue, setSearchValue] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('all');

    const getFilteredScripts = (scriptType) => {
        let filetred = scripts[scriptType] || [];

        if (selectedCategory !== 'all') {
            filetred = filetred.filter((script) => script.category === selectedCategory);
        }

        if (searchValue.trim()) {
            const fuse = new Fuse(filetred, {
                keys: ['title', 'description', 'category', 'name', 'tags', 'author', 'id', 'longDescription']
            });
            filetred = fuse.search(searchValue).map((obj) => obj.item);
        }

        

        return filetred;
    };


    return {
        searchValue,
        selectedCategory,
        setSearchValue,
        setSelectedCategory,
        getFilteredScripts
    };
}