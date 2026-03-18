import {Modal} from "@mui/material";
import {useFileSelectStore} from "../../stores/useFileSelectStore.ts";
import FileSelect from "./FileSelect.tsx";
import Button from "../Button/Button.tsx";
import {useState} from "react";
import {useErrorStore} from "../../stores/useErrorStore.ts";
import processFiles from "../../utils/files.ts";
import {useModsStore} from "../../stores/useModsStore.ts";

function FileSelectModal() {
    const {modalOpen, setModalOpen, filePaths, setFilePaths} = useFileSelectStore();
    const {setMods, getModsFromRust} = useModsStore();
    const {setVisible, setError} = useErrorStore();
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const onClose = () => {
        setModalOpen(false);
        setFilePaths([])
    }

    const setChecked = (checked: boolean, index: number) => {
        switch (checked) {
            case true:
                setSelectedFiles(prevState => [...prevState, filePaths[index]])
                return;
            case false:
                setSelectedFiles(prevState => prevState.filter((_, idx) => idx !== index))
                return;
        }
    }

    const onConfirmClick = async () => {
        try {
            await processFiles({files: selectedFiles})
            setMods(await getModsFromRust())
        } catch (e) {
            setVisible(true);
            setError(e as string)
        } finally {
            onClose();
        }
    }

    return (
        <Modal open={modalOpen} onClose={onClose}>
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/4 h-2/3 bg-darkBlue rounded-md min-w-160 min-h-100 flex flex-col">
                <div className="mt-8 mx-8">
                    <div className="font-bold text-3xl">Multiple vpk files detected</div>
                    <div className="font-bold text-xl mt-4">Please select which mod(s) to add</div>
                </div>

                <div className="flex-1 mt-4 mx-8 overflow-y-auto flex flex-col gap-2 rounded-md">
                    {filePaths.map((filePath, index) => (
                        <FileSelect filePath={filePath} setChecked={setChecked} index={index} key={index}/>
                    ))}
                </div>

                <div className="mb-4 mx-4 flex justify-between">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={onConfirmClick}>Confirm</Button>
                </div>
            </div>
        </Modal>
    )
}

export default FileSelectModal;