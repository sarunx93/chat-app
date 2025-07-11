import { doc, getDoc } from 'firebase/firestore'
import { create } from 'zustand'
import { db } from './firebase'
import { UserType } from '../types'


type UserStoreState = {
  currentUser: UserType | null
  isLoading: boolean
  fetchUserInfo: (uid: string | undefined) => Promise<void>
}

export const useUserStore = create<UserStoreState>((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid: string | undefined) => {
    if (!uid) return set({ currentUser: null, isLoading: false })
    try {
      const docRef = doc(db, 'users', uid.toString())
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        set({ currentUser: docSnap.data() as UserType, isLoading: false })
      } else {
        set({ currentUser: null, isLoading: false })
      }
      
    } catch (error) {
      console.log(error)
      return set({ currentUser: null, isLoading: false })
    }
  },

  
}))
