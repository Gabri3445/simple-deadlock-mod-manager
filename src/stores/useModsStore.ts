import {listMods, Mods} from "../generated";
import {create} from "zustand";

//TODO: add functions to change mods from loaded to unloaded
interface ModsStore {
    mods: Mods,
    setMods: (mods: Mods) => void;
    getModsFromRust: () => Promise<Mods>;
}

export const useModsStore = create<ModsStore>((set) => ({
    mods: {
        loaded_mods: [],
        unloaded_mods: []
    },
    setMods: (mods: Mods) => set({mods: mods}),
    getModsFromRust: async () => {
        return await listMods();
    }
}));