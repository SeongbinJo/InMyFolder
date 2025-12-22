import { create } from "zustand";
import type { User } from "firebase/auth";

type UserState = {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
}

export const userState = create<UserState>((set) => ({
    currentUser: null,
    setCurrentUser: (user) => set({ currentUser: user})
}))
