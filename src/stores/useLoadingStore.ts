import {create} from "zustand";

interface LoadingStore {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

export const useLoadingStore = create<LoadingStore>((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({isLoading})
}))