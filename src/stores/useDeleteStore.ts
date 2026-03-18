import {create} from "zustand";

interface DeleteStore {
    fileName: string;
    setFileName: (fileName: string) => void;
    userName: string;
    setUserName: (userName: string) => void;
    modalOpen: boolean;
    setModalOpen: (modalOpen: boolean) => void;
}

export const useDeleteStore = create<DeleteStore>((set) => ({
    fileName: "",
    setFileName: (fileName) => {
        set({fileName})
    },
    userName: "",
    setUserName: (userName) => {
        set({userName})
    },
    modalOpen: false,
    setModalOpen: (modalOpen: boolean) => {
        set({modalOpen})
    },
}))