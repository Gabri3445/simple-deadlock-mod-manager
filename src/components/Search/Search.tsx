import Button from "../Button/Button.tsx";
import {useState} from "react";
import SearchBox from "./SearchBox.tsx";
import {autoUpdate, useFloating} from "@floating-ui/react";

function Search() {

    const [open, setOpen] = useState<boolean>(false)
    const {refs, floatingStyles} = useFloating({
        whileElementsMounted: autoUpdate,
        open: open,
        onOpenChange: setOpen,
    });

    const onSearchClick = () => {
        setOpen(true)
    }

    return (
        <>
            <Button ref={refs.setReference} onClick={onSearchClick}>Search</Button>
            {open && (
                <SearchBox ref={refs.setFloating} style={floatingStyles} setOpen={setOpen}/>
            )}
        </>
    )
}

export default Search;