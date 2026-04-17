import {create} from "zustand";

interface ModManageStore {
    fileName: string;
    setFileName: (fileName: string) => void;
    userName: string;
    setUserName: (userName: string) => void;
    modManageModalOpen: boolean;
    setModManageModalOpen: (modManageModalOpen: boolean) => void;
}

export const useModManageStore = create<ModManageStore>((set) => ({
    fileName: "",
    setFileName: (fileName) => {
        set({fileName});
    },
    userName: "",
    setUserName: (userName) => {
        set({userName})
    },
    modManageModalOpen: false,
    setModManageModalOpen: (modManageModalOpen: boolean) => {
        set({modManageModalOpen});
    }
}))