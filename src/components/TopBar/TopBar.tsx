import Button from "../Button/Button.tsx";
import {open} from "@tauri-apps/plugin-dialog";
import {downloadDir} from "@tauri-apps/api/path";
import Options from "../Options/Options.tsx";
import {useState} from "react";

function TopBar() {

    const onLoadModClick = async (): Promise<void> => {
        // @ts-ignore
        const file = await open({
            multiple: true,
            directory: false,
            defaultPath: await downloadDir()
        })
        //TODO: pass to rust and copy to game mod folder
    }

    const [openModal, setOpenModal] = useState<boolean>(false)
    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)

    return (
        <div className="w-full bg-topbar p-4 flex justify-between">
            <h1 className="text-3xl block font-bold">Deadlock Mod Manager</h1>
            <div className="flex gap-4">
                <Button onClick={onLoadModClick}>Load Mod</Button>
                <Button onClick={handleOpenModal}>Options</Button>
                <Options isOpen={openModal} onClose={handleCloseModal}/>
                <Button>Apply</Button>
            </div>
        </div>
    )
}

export default TopBar;