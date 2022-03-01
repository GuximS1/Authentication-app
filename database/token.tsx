import create from "zustand";

import { persist, devtools } from "zustand/middleware";
interface TodoState {
  accessToken: String;
  setAccessToken: (access: string) => void;
}

export const useStore = create<TodoState>(
  persist(
    (set, get) => ({
      accessToken: "",
      setAccessToken: (access) => {
        set((state) => ({
          accessToken: access,
        }));
      },
    }),
    {
      name: "accessToken", // unique name
      getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
