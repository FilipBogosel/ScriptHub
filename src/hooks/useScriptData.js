import React, { useEffect, useState } from "react";
//import { officialMockScripts, myMockScripts, communityMockScripts } from "../data/mockData";
import Fuse from "fuse.js";

//handles data and filtering logic
export function useScriptData() {

    const [scripts, setScripts] = useState({
        official: [],
        my: [],
        community: []
    });

    useEffect(() => {
        async function fetchScripts(){
            const allScripts = await window.electronAPI.loadScripts();

            const official = allScripts.official;
            const my = allScripts.my;
            const community = allScripts.community;
            setScripts({official, my, community});
        }
        fetchScripts(); 
    }, []);

    const [searchValue, setSearchValue] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('all');

    const getFilteredScripts = (scriptType) => {
        let filtered = scripts[scriptType] || [];

        if (selectedCategory !== 'all') {
            filtered = filtered.filter((script) => script.category === selectedCategory);
        }

        if (searchValue.trim()) {
            const fuse = new Fuse(filtered, {
                keys: ['title', 'description', 'category', 'name', 'tags', 'author', 'id', 'longDescription']
            },);
            filtered = fuse.search(searchValue).map((obj) => obj.item);
        }



        return filtered;
    };


    return {
        searchValue,
        selectedCategory,
        setSearchValue,
        setSelectedCategory,
        getFilteredScripts
    };
}