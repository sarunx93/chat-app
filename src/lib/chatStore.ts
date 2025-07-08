import { doc, getDoc } from 'firebase/firestore'
import { create } from 'zustand'
import { db } from './firebase'
import { useUserStore } from './userStore'

type ChatStoreState = {
  chatId: string | null
  user: any | null
  isCurrentUserBlocked: boolean | null
  isReceiverBlocked: boolean | null
  changeChat: any
}

export const useChatStore = create<ChatStoreState>((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId: string, user: any) => {
    const currentUser = useUserStore.getState().currentUser

    //check if the current user is blocked.
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      })
    }

    //check if the receiver is blocked.
    if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      })
    }
  },
}))
