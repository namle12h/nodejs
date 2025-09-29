import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface ITokens {
    accessToken: string;
    refreshToken: string;
}

interface IUser {
    id: number;
    email: string;
    username: string;
    role: string;
    name: string;
    
    // Thêm các trường khác nếu cần
}

type TAuthStore = {
    token: ITokens | null;
    user: IUser | null;
    setToken: (token: ITokens) => void;
    clearToken: () => void;
    setUser: (user: IUser | null) => void;
}

export const useAuthStore = create<TAuthStore>()(
    devtools(
        persist(
            (set) => ({
                token: null,
                user: null,
                setToken: (token: ITokens) => set({ token }),
                clearToken: () => set({ token: null }),
                setUser: (user: IUser | null) => set({ user }),
            }),
            {
                name: 'auth-storage', // tên key lưu trong localStorage
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);