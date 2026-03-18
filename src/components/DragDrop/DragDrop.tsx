import {useEffect, useRef, useState} from "react";
import {getCurrentWebview} from "@tauri-apps/api/webview";
import {UnlistenFn} from "@tauri-apps/api/event";
import {useModsStore} from "../../stores/useModsStore.ts";
import {useErrorStore} from "../../stores/useErrorStore.ts";
import processFiles from "../../utils/files.ts";
import {useFileSelectStore} from "../../stores/useFileSelectStore.ts";

function DragDrop() {
    const [dragging, setDragging] = useState<boolean>(false);
    const listenerRegistered = useRef(false);
    const {getModsFromRust, setMods} = useModsStore();
    const {setError, setVisible} = useErrorStore();
    const {setModalOpen, setFilePaths} = useFileSelectStore();
    useEffect(() => {
        if (listenerRegistered.current) return;
        listenerRegistered.current = true;
        let unlisten: UnlistenFn;

        getCurrentWebview()
            .onDragDropEvent(async (event) => {
                if (event.payload.type === 'over') {
                    setDragging(true);
                } else if (event.payload.type === 'drop') {
                    setDragging(false);
                    try {
                        await processFiles({
                            files: event.payload.paths,
                            setFilePaths,
                            setFileSelectModalOpen: setModalOpen
                        });
                        setMods(await getModsFromRust());
                    } catch (e) {
                        setVisible(true);
                        setError(e as string);
                    }
                } else {
                    setDragging(false);
                }
            })
            .then((fn) => {
                unlisten = fn;
            });

        return () => {
            if (unlisten) unlisten();
        };
    }, []);


    return (
        <div
            className={`fixed top-0 left-0 h-screen w-screen flex items-center justify-center bg-gray-800/80 transition-all ${dragging ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="text-8xl font-bold animate-pulse">
                Drop here
            </div>
        </div>
    )

}

export default DragDrop;