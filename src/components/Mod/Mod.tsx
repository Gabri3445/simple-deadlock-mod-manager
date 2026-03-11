import {useState} from "react";
import {Textfit} from 'react-textfit';
import {Tooltip} from "@mui/material";
import {useModsStore} from "../../stores/useModsStore.ts";

function Mod({modName, fileName}: { modName: string, fileName: string }) {
    const colors = ["bg-gunItem", "bg-vitalityItem", "bg-spiritItem"];
    const {changeModName} = useModsStore()

    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(modName);

    const [color] = useState(colors[Math.floor(Math.random() * colors.length)]);

    return (
        <div className={`${color} h-20 flex items-center justify-center text-black font-bold rounded-lg`}>
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
        </div>
    );
}

export default Mod;