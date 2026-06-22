import {create} from "zustand";

export enum SearchType {
    UserName,
    FileName
}

interface SearchStore {
    search: string;
    setSearch: (search: string) => void;
    searchType: SearchType;
    setSearchType: (searchType: SearchType) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
    search: "",
    setSearch: (search) => {
        set({search});
    },
    searchType: SearchType.UserName,
    setSearchType: (searchType: SearchType) => {
        set({searchType});
    }
}))