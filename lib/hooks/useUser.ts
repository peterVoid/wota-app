import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  userStore: string[];
  addToStore: (item: string) => void;
}

const useUser = create(
  persist<UserStore>(
    (set, get) => ({
      userStore: [],
      addToStore: (item: string) => {
        set((state) => ({
          userStore: [...state.userStore, item],
        }));
      },
    }),
    {
      name: "userStore",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUser;
