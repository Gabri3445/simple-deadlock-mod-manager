import {Modal} from "@mui/material";
import Button from "../Button/Button.tsx";
import {useEffect, useState} from "react";
import {
    changePath,
    checkGameinfoValidity,
    getAutoDetectDeadlockPath,
    getConfig,
    makeConfigValid
} from "../../generated";
import {useModsStore} from "../../stores/useModsStore.ts";

function Options({isOpen, onClose}: { isOpen: boolean, onClose: () => void }) {
    const {setMods, getModsFromRust} = useModsStore();
    const [path, setPath] = useState("");
    const [validConfig, setValidConfig] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        getOptionsConfig();
    }, [])

    const getOptionsConfig = async () => {
        try {
            const config = await getConfig();
            if (config.deadlock_path === "") {
                const path = await getAutoDetectDeadlockPath();
                await changePath({path: path});
                setMods(await getModsFromRust());
                setPath(path);
            } else {
                setPath(config.deadlock_path);
            }
            setValidConfig(await checkGameinfoValidity())
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const onApply = async () => {
        try {
            await changePath({path: path});
            setMods(await getModsFromRust());
            //TODO: need to call getmods again in modtab
            onClose();
        } catch (e) {
            console.error(e)
        }
    }

    const onAutoDetectClick = async () => {
        try {
            setPath(await getAutoDetectDeadlockPath());
            await changePath({path: path});
            setValidConfig(await checkGameinfoValidity());
            setMods(await getModsFromRust());
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
                            {!loading && (
                                <>
                                    <div className="mt-8 text-xl">
                                        <label className="block mb-2" htmlFor="pathInput">
                                            Deadlock Path
                                        </label>
                                        <div className="flex">
                                            <div className="bg-gray-800 grow mr-20"><input id="pathInput" value={path}
                                                                                           onChange={(e) => {
                                                                                               setPath(e.target.value)
                                                                                           }}
                                                                                           onKeyDown={async (e) => {
                                                                                               if (e.key === "Enter") {
                                                                                                   await changePath({path: path});
                                                                                                   setMods(await getModsFromRust());
                                                                                                   setValidConfig(await checkGameinfoValidity());
                                                                                               }
                                                                                           }}
                                                                                           className="text-lg m-1 w-full mr-1"/>
                                            </div>
                                            <Button onClick={onAutoDetectClick}>
                                                Auto-Detect
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-8 text-xl">
                                        <label className="block mb-2">gameinfo.gi file status</label>
                                        <div className="flex gap-2">
                                            <div
                                                className={`bg-gray-800 grow pl-2 ${validConfig ? "bg-green-500" : "bg-red-500"}`}>{validConfig ? "Valid" : "Not valid"}</div>
                                            <Button onClick={async () => {
                                                try {
                                                    setValidConfig(await checkGameinfoValidity());
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }}>Check Validity</Button>
                                            <Button onClick={async () => {
                                                try {
                                                    await makeConfigValid();
                                                    setValidConfig(await checkGameinfoValidity());
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }}>Make valid</Button>
                                        </div>
                                    </div>
                                </>
                            )}
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