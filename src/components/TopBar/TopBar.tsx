import Button from "../Button/Button.tsx";
import {open} from "@tauri-apps/plugin-dialog";
import {downloadDir} from "@tauri-apps/api/path";
import Options from "../Options/Options.tsx";
import {useState} from "react";
import {useModsStore} from "../../stores/useModsStore.ts";
import {useErrorStore} from "../../stores/useErrorStore.ts";
import processFiles from "../../utils/files.ts";
import {useFileSelectStore} from "../../stores/useFileSelectStore.ts";


function TopBar() {

    const {applyModChanges, getModsFromRust, setMods} = useModsStore();
    const {setModalOpen, setFilePaths} = useFileSelectStore();
    const {setError, setVisible} = useErrorStore();

    const onModAddClick = async (): Promise<void> => {
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
        }
    }

    const [openModal, setOpenModal] = useState<boolean>(false)
    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)

    return (
        <div className="w-full bg-topbar p-4 flex justify-between sticky top-0 z-10">
            <h1 className="text-3xl block font-bold">Simple Deadlock Mod Manager</h1>
            <div className="flex gap-4">
                <Button onClick={onModAddClick}>Add Mod</Button>
                <Button onClick={handleOpenModal}>Options</Button>
                <Options isOpen={openModal} onClose={handleCloseModal}/>
                <Button onClick={async () => {
                    try {
                        await applyModChanges();
                    } catch (error) {
                        setError(error as string);
                        setVisible(true);
                    }
                    //TODO: auto apply button in settings
                }}>Apply</Button>
            </div>
        </div>
    )
}

export default TopBar;