import {useErrorStore} from "../../stores/useErrorStore.ts";
import {Modal} from "@mui/material";
import Button from "../Button/Button.tsx";
import {open} from "@tauri-apps/plugin-dialog";
import {downloadDir} from "@tauri-apps/api/path";
import processFiles from "../../utils/files.ts";
import {useModsStore} from "../../stores/useModsStore.ts";
import {useFileSelectStore} from "../../stores/useFileSelectStore.ts";

function AddModModal({modalOpen, setModalOpen}: { modalOpen: boolean, setModalOpen: (open: boolean) => void }) {
    const {setVisible, setError} = useErrorStore();
    const {getModsFromRust, setMods} = useModsStore();
    const {setFilePaths} = useFileSelectStore();

    const onBrowseButtonClick = async () => {
        try {
            const files = await open({
                multiple: true,
                directory: false,
                defaultPath: await downloadDir(),
                filters: [
                    {
                        name: "Vpk files",
                        extensions: ["vpk"]
                    },
                    {
                        name: "Compressed files",
                        extensions: ["zip", "rar"]
                    }
                ]
            })

            if (files) {
                await processFiles({files, setFilePaths, setFileSelectModalOpen: setModalOpen});
                setMods(await getModsFromRust());
            }
        } catch (error) {
            setVisible(true);
            setError(error as string);
        } finally {
            setModalOpen(false);
        }
    }

    return (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/4 h-2/4 bg-darkBlue rounded-md min-w-160 min-h-100 flex flex-col">
                <div className="mt-8 mx-8">
                    <div className="font-bold text-3xl">Add a mod</div>
                </div>
                <div className="flex-1 flex flex-col gap-4 mx-8 mt-8 ">
                    <div className="text-xl flex h-fit justify-between w-full">
                        Pick a .vpk or .zip/.rar file
                        <Button onClick={onBrowseButtonClick}>Browse</Button>
                    </div>
                    <div className="text-xl mb-2">
                        Download from GameBanana
                        <div className="flex">
                            <div className="bg-gray-800 grow mr-2">
                                <input className="text-lg m-1 w-full mr-2" type={"text"}/>
                            </div>
                            <Button>Download</Button>
                        </div>

                    </div>
                </div>
                <div className="mb-4 mx-4 flex justify-between">
                    <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                </div>
            </div>
        </Modal>
    )
}

export default AddModModal;