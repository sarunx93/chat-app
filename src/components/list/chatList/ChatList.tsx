import { useEffect, useState } from 'react'
import './chatList.css'
import AddUser from './addUser/AddUser'
import { useUserStore } from '../../../lib/userStore'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { DocumentData } from 'firebase/firestore'
import { useChatStore } from '../../../lib/chatStore'
import { ChatType } from '../../../types'

const ChatList = () => {
  const [addMode, setAddmode] = useState<boolean>(false)
  const [chats, setChats] = useState<DocumentData | undefined>(undefined)
  const [input, setInput] = useState('')
  const { currentUser } = useUserStore()
  const { changeChat } = useChatStore()

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'userchats', currentUser?.id as string), async (res) => {
      const items = res.data()?.chats

      const promises = items.map(async (item: ChatType) => {
        const userDocRef = doc(db, 'users', item.receiverId)
        const userDocSnap = await getDoc(userDocRef)

        const user = userDocSnap.data()
        return { ...item, user }
      })

      const chatData = await Promise.all(promises)
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt))
    })

    return () => {
      unsub()
    }
  }, [currentUser?.id])

  const toggleAddMode = () => {
    setAddmode((prev) => !prev)
  }

  const handleSelect = async (chat: ChatType) => {
    console.log('chat', chat)
    const userChats = chats?.map((item: ChatType) => {
      const { user, ...rest } = item
      return rest
    })

    const chatIndex = userChats.findIndex((item: any) => item.chatId === chat.chatId)

    userChats[chatIndex].isSeen = true

    const userChatsRef = doc(db, 'userchats', currentUser?.id as string)

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      })
      changeChat(chat.chatId, chat.user)
    } catch (error) {
      console.log(error)
    }
  }

  const filteredChats = chats?.filter((c: any) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  )

  return (
    <div className='chat-list'>
      <div className='search'>
        <div className='search-bar'>
          <img src='/search.png' alt='search' />
          <input type='text' placeholder='search' onChange={(e) => setInput(e.target.value)} />
        </div>
        <img
          src={addMode ? './minus.png' : './plus.png'}
          alt='plus button'
          className='add'
          onClick={toggleAddMode}
        />
      </div>

      {filteredChats?.map((chat: any) => (
        <div
          className='item'
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat.isSeen ? 'transparent' : '#5183fe',
          }}>
          <img
            src={
              chat.user.blocked.includes(currentUser?.id)
                ? './avatar.png'
                : chat.user.avatar || 'avatar.png'
            }
            alt=''
          />
          <div className='texts'>
            <span>{chat.user.blocked.includes(currentUser?.id) ? 'User' : chat.user.username}</span>
            <p>{chat.lastMessage || '🖼️ Image'}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  )
}
export default ChatList
