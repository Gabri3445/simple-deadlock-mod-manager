import {create} from "zustand";

interface FileSelectStore {
    modalOpen: boolean;
    setModalOpen: (modalOpen: boolean) => void;
    filePaths: string[];
    setFilePaths: (fileNames: string[]) => void;
    addFilePath: (path: string) => void;
}

export const useFileSelectStore = create<FileSelectStore>((set, get) => ({
    modalOpen: false,
    setModalOpen: (modalOpen) => {
        set(() => ({modalOpen}))
    },
    filePaths: [],
    setFilePaths: (fileNames) => {
        set(() => ({filePaths: fileNames}))
    },
    addFilePath: (path) => {
        const filePaths = [...get().filePaths];
        filePaths.push(path);
        set(() => ({filePaths}))
    }
}))