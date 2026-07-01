import {ClickAwayListener} from "@mui/material";
import {CSSProperties, Ref, useEffect, useState} from "react";
import {SearchType, useSearchStore} from "../../stores/useSearchStore.ts";


function SearchBox({ref, style, setOpen}: { ref?: Ref<any>, style?: CSSProperties, setOpen: (open: boolean) => void }) {
    const {setSearch, search, searchType, setSearchType} = useSearchStore();
    const [placeholder, setPlaceholder] = useState("");

    useEffect(() => {
        switch (searchType) {
            case SearchType.UserName:
                setPlaceholder("Enter name Here...")
                break;
            case SearchType.FileName:
                setPlaceholder("Enter file number here...")
                break;
        }
    }, [searchType]);

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div ref={ref} style={style} className={"bg-topbar border rounded-md shadow-2xl top-2! p-4"}>
                <div className={"flex border font-bold"}>
                    <button
                        onClick={() => setSearchType(SearchType.UserName)}
                        className={`border border-l-0 border-y-0 px-2 py-4 hover:bg-gray-300 hover:text-topbar transition-colors ${searchType === SearchType.UserName ? "bg-white! text-topbar!" : ""}`}>
                        Search User Name
                    </button>
                    <button
                        onClick={() => setSearchType(SearchType.FileName)}
                        className={`px-2 py-4 hover:bg-gray-300 hover:text-topbar transition-colors ${searchType === SearchType.FileName ? "bg-white! text-topbar!" : ""}`}>
                        Search File Name
                    </button>
                </div>
                <div className={"mt-4 w-full"}>
                    <input onChange={(e) => {
                        setSearch(e.target.value);
                    }} value={search} className={"border p-2 w-full"} autoFocus placeholder={placeholder}/>
                </div>
            </div>
        </ClickAwayListener>
    )
}

export default SearchBox;