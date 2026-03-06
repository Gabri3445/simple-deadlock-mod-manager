import Button from "../Button/Button.tsx";
import {open} from "@tauri-apps/plugin-dialog";
import {downloadDir} from "@tauri-apps/api/path";

function TopBar() {

    const onLoadModClick = async (): Promise<void> => {
        const file = await open({
            multiple: true,
            directory: false,
            defaultPath: await downloadDir()
        })
        //TODO: pass to rust and copy to game mod folder
    }

    return (
        <div className="w-full bg-topbar p-4 flex justify-between">
            <h1 className="text-3xl block font-bold">Deadlock Mod Manager</h1>
            <div className="flex gap-4">
                <Button onClick={onLoadModClick}>Load Mod</Button>
                <Button>Options</Button>
                <Button>Apply</Button>
            </div>
        </div>
    )
}

export default TopBar;