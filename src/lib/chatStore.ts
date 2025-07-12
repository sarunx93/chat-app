import { doc, getDoc } from 'firebase/firestore'
import { create } from 'zustand'
import { db } from './firebase'
import { useUserStore } from './userStore'
import { UserType } from '../types'

type ChatStoreState = {
  chatId: string | null
  user: UserType | null
  isCurrentUserBlocked: boolean
  isReceiverBlocked: boolean
  changeChat: (chatId: string, user: UserType) => void
  changeBlock: ()=>void
}

export const useChatStore = create<ChatStoreState>((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  //when switch to other chat.
  changeChat: (chatId: string, user: UserType) => {
    const currentUser = useUserStore.getState().currentUser
  
    //check if the current user is blocked.
    if (user?.blocked.includes(currentUser?.id as string)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      })
    }

    //check if the receiver is blocked.
    else if (currentUser?.blocked.includes(user?.id)) {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      })
    } else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      })
    }
  },
  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }))
  },
}))
