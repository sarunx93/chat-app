import { useState } from 'react'
import './addUser.css'
import { db } from '../../../../lib/firebase'
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { useUserStore } from '../../../../lib/userStore'
import { UserType } from '../../../../types'
const AddUser = () => {
  const [user, setUser] = useState<UserType | null>(null)
  const { currentUser } = useUserStore()
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username')

    try {
      const userRef = collection(db, 'users')
      const q = query(userRef, where('username', '==', username))
      const querySnapShot = await getDocs(q)

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data() as UserType)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddUser = async () => {
    const chatRef = collection(db, 'chats')
    const userChatsRef = collection(db, 'userchats')
    try {
      const newChatRef = doc(chatRef)
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      })

      await updateDoc(doc(userChatsRef, user?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: '',
          receiverId: currentUser?.id,
          updatedAt: Date.now(),
        }),
      })

      await updateDoc(doc(userChatsRef, currentUser?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: '',
          receiverId: user?.id,
          updatedAt: Date.now(),
        }),
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='add-user'>
      <form onSubmit={handleSearch}>
        <input type='text' placeholder='Username' name='username' />
        <button>Search</button>
      </form>
      {user && (
        <div className='user'>
          <div className='detail'>
            <img src={user ? user.avatar : './avatar.png'} alt='' />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAddUser}>Add User</button>
        </div>
      )}
    </div>
  )
}
export default AddUser
