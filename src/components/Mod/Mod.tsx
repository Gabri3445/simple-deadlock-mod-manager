import {useState} from "react";
import {Textfit} from 'react-textfit';
import {Tooltip} from "@mui/material";
import {useModsStore} from "../../stores/useModsStore.ts";
import {ModTabVariant} from "../ModTab/ModTab.tsx";

function Mod({modName, fileName, variant}: { modName: string, fileName: string, variant: ModTabVariant }) {
    const colors = ["bg-gunItem", "bg-vitalityItem", "bg-spiritItem"];
    const {changeModName, addSelectedMod, removeSelectedMod, selectedMods} = useModsStore()

    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(modName);

    const [color] = useState(colors[Math.floor(Math.random() * colors.length)]);

    return (
        <div
            className={`${color} h-30 relative flex flex-col items-center justify-center text-black font-bold rounded-lg`}>
            {isEditing ? (
                <input
                    value={value}
                    autoFocus
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={async () => {
                        setIsEditing(false)
                        await changeModName(value, fileName)
                    }}
                    onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                            setIsEditing(false);
                            await changeModName(value, fileName)
                        }
                    }}
                    className="bg-transparent text-center outline-none border"
                />
            ) : (
                <div onDoubleClick={() => setIsEditing(true)} className={"w-full text-center px-2"}>
                    <Tooltip title={"Double click to edit name"}>
                        <div>
                            <Textfit mode={"single"} max={25}>
                                {value}
                            </Textfit>
                        </div>
                    </Tooltip>
                </div>
            )}
            {/* Not sure if load order matters, todo at a later date if it does
            <div className="flex gap-2 h-7">
                <Button>&lt;</Button>
                <Button>&gt;</Button>
            </div>
            */}
            <div className="absolute top-2 right-2">
                <input
                    className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                    type={"checkbox"}
                    onChange={(e) => {
                        if (selectedMods.filter((f) => (f.variant !== variant)).length > 0) {
                            e.target.checked = !e.target.checked;
                            return;
                        }
                        switch (e.target.checked) {
                            case true:
                                addSelectedMod({variant, fileName, userName: modName})
                                break;
                            case false:
                                removeSelectedMod({variant, fileName, userName: modName})
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default Mod;