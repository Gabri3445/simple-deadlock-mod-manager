import {ClickAwayListener} from "@mui/material";
import {CSSProperties, Ref} from "react";


function SearchBox({ref, style, setOpen}: { ref?: Ref<any>, style?: CSSProperties, setOpen: (open: boolean) => void }) {
    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div ref={ref} style={style} className={"bg-topbar border rounded-md shadow-2xl top-2! p-4"}>
                <div className={"flex border font-bold"}>
                    <button
                        className={"border border-l-0 border-y-0 px-2 py-4 hover:bg-gray-300 hover:text-topbar transition-colors focus:bg-white focus:text-topbar"}>Search
                        User Name
                    </button>
                    <button
                        className={"px-2 py-4 hover:bg-gray-300 hover:text-topbar transition-colors focus:bg-white focus:text-topbar"}>Search
                        File Name
                    </button>
                </div>
                <div className={"mt-4 w-full"}>
                    <input className={"border p-2 w-full"} autoFocus placeholder={"Enter name Here..."}/>
                </div>
            </div>
        </ClickAwayListener>
    )
}

export default SearchBox;