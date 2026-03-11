import {changeModName, listMods, Mods} from "../generated";
import {create} from "zustand";
import {ModTabVariant} from "../components/ModTab/ModTab.tsx";

interface SelectedMod {
    variant: ModTabVariant,
    fileName: string,
    userName: string,
}

//TODO: add functions to change mods from loaded to unloaded
interface ModsStore {
    mods: Mods,
    selectedMods: SelectedMod[],
    addSelectedMod: (mod: SelectedMod) => void,
    removeSelectedMod: (mod: SelectedMod) => void,
    changeModLoadStatus: (mods: SelectedMod[]) => void,
    setMods: (mods: Mods) => void;
    getModsFromRust: () => Promise<Mods>;
    changeModName: (userName: string, fileName: string) => Promise<void>;
}

export const useModsStore = create<ModsStore>((set) => ({
    mods: {
        loaded_mods: [],
        unloaded_mods: []
    },
    selectedMods: [],
    addSelectedMod: (mod: SelectedMod) => {
        set((s) => ({
            selectedMods: [...s.selectedMods, mod]
        }));
    },
    removeSelectedMod: (mod: SelectedMod) => {
        set((s) => ({
            selectedMods: s.selectedMods.filter((selectedMod) => selectedMod.fileName !== mod.fileName)
        }));
    },
    changeModLoadStatus: (selectedMods: SelectedMod[]) => {
        set((state) => {
            let loaded = [...state.mods.loaded_mods];
            let unloaded = [...state.mods.unloaded_mods];

            selectedMods.forEach((mod) => {
                if (mod.variant === ModTabVariant.LoadedMods) {
                    // move from loaded -> unloaded
                    loaded = loaded.filter(m => m.file_name !== mod.fileName);
                    const moved = state.mods.loaded_mods.find(m => m.file_name === mod.fileName);
                    if (moved) unloaded.push(moved);
                } else {
                    // move from unloaded -> loaded
                    unloaded = unloaded.filter(m => m.file_name !== mod.fileName);
                    const moved = state.mods.unloaded_mods.find(m => m.file_name === mod.fileName);
                    if (moved) loaded.push(moved);
                }
            });

            return {
                mods: {
                    loaded_mods: loaded,
                    unloaded_mods: unloaded
                },
                selectedMods: []
            };
        });
    },
    setMods: (mods: Mods) => set({mods: mods}),
    getModsFromRust: async () => {
        return await listMods();
    },
    changeModName: async (userName: string, fileName: string) => {
        await changeModName({fileName, userName});
        set({mods: await listMods()});
    },
}));