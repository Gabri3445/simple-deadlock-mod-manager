import {Modal} from "@mui/material";
import Button from "../Button/Button.tsx";
import {useEffect, useState} from "react";
import {changePath, getDeadlockPath, loadConfigCommand} from "../../generated";

function Options({isOpen, onClose}: { isOpen: boolean, onClose: () => void }) {
    const [path, setPath] = useState("");
    useEffect(() => {
        loadConfigCommand({
            onSuccess: (r) => setPath(r.deadlock_path),
            onInvokeError: (r) => console.error(r)
        }).then();
    }, [])

    const onApply = async () => {
        try {
            await changePath({path: path});
            onClose();
        } catch (e) {
            console.error(e)
        }
    }

    const onAutoDetectClick = async () => {
        try {
            setPath(await getDeadlockPath());
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <Modal onClose={onClose} open={isOpen}>
            <div className="absolute top-1/2 left-1/2 -translate-1/2 w-2/4 h-2/3 bg-darkBlue rounded-md">
                <div className="mx-8 h-full">
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <div className="text-white mt-8 text-3xl font-extrabold">
                                Options
                            </div>
                            <div className="mt-8 text-xl">
                                <label className="block mb-2" htmlFor="pathInput">
                                    Deadlock Path
                                </label>
                                <div className="flex">
                                    <div className="bg-gray-800 grow mr-20"><input id="pathInput" value={path}
                                                                                   onChange={(e) => {
                                        setPath(e.target.value)
                                    }} className="text-lg m-1 w-full mr-1"/>
                                    </div>
                                    <Button onClick={onAutoDetectClick}>
                                        Auto-Detect
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="mb-8">
                            <div className="flex w-full justify-between">
                                <Button onClick={onClose}>Close</Button>
                                <Button onClick={onApply}>Apply</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default Options;