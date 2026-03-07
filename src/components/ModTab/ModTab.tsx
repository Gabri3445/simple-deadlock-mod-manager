import Mod from "../Mod/Mod.tsx";

export enum ModTabVariant {
    LoadedMods,
    UnloadedMods
}

function ModTab({variant}: { variant: ModTabVariant }) {
    return (
        <div className="flex-1 bg-cream p-3 first:pr-1.5">
            <div className="border-3 h-full border-t-0 border-darker-cream">
                <div
                    className="bg-darker-cream text-white h-8.75 leading-8.75 pl-2">{variant === ModTabVariant.LoadedMods ? "Loaded Mods" : "Unloaded Mods"}</div>
                <div className="px-2 pt-2 grid grid-cols-3 gap-2">
                    <Mod modName={"Testing"}/>
                    <Mod modName={"Testing"}/>
                    <Mod modName={"Testing"}/>
                    <Mod modName={"Testing"}/>
                </div>
            </div>
        </div>
    )
}

export default ModTab;