import {Modal} from "@mui/material";
import {useFileSelectStore} from "../../stores/useFileSelectStore.ts";
import FileSelect from "./FileSelect.tsx";
import Button from "../Button/Button.tsx";

function FileSelectModal() {
    const {modalOpen, setModalOpen, filePaths, setFilePaths} = useFileSelectStore()
    const onClose = () => {
        setModalOpen(false);
        setFilePaths([])
    }
    return (
        <Modal open={modalOpen} onClose={onClose}>
            <div
                className="absolute top-1/2 left-1/2 -translate-1/2 w-2/4 h-2/3 bg-darkBlue rounded-md min-w-160 min-h-100">
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <div className="mt-8 mx-8">
                            <div className="font-bold text-3xl">
                                Multiple vpk files detected
                            </div>
                            <div className="font-bold text-xl mt-4">
                                Please select which mod(s) to add
                            </div>
                            <div className="bg-gray-800 flex flex-col gap-2 rounded-md overflow-y-scroll">
                                {filePaths.map((filePath, index) => (
                                    <FileSelect filePath={filePath} checked={false} key={index}/>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mb-4 mx-4 flex justify-between">
                        <Button onClick={onClose}>Cancel</Button>
                        <Button>Confirm</Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default FileSelectModal;