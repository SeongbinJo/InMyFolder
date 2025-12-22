import { create } from "zustand";

export const userState = create((set) => ({
    currentUser: null,
    setCurrentUser: (user) => set({ currentUser: user})
}))
