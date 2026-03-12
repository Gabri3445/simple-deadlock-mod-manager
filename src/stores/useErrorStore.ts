import {create} from "zustand";

interface ErrorStore {
    visible: boolean;
    error: string;
    setVisible: (visible: boolean) => void;
    setError: (error: string) => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
    visible: false,
    error: "",
    setVisible: (visible) => {
        set(() => ({
            visible
        }))
    },
    setError: (error: string) => {
        set(() => ({
            error
        }))
    }
}))