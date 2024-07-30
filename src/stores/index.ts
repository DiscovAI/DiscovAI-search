import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createMessageSlice, ChatStore } from "./slices/messageSlice";

type StoreState = ChatStore;

const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createMessageSlice(...a),
    }),
    {
      name: "store",
      partialize: (state) => ({
        // messages: state.messages, TODO
      }),
    }
  )
);

export const useChatStore = () =>
  useStore((state) => ({
    messages: state.messages,
    addMessage: state.addMessage,
    setMessages: state.setMessages,
    threadId: state.threadId,
    setThreadId: state.setThreadId,
  }));
