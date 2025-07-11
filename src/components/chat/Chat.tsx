import { useState, useRef, useEffect } from 'react'
import './chat.css'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { arrayUnion, doc, DocumentData, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore'
import upload from '../../lib/upload'

const chat = () => {
  const [openEmoji, setOpenEmoji] = useState<boolean>(false)
  const [text, setText] = useState<string>('')
  const [chat, setChat] = useState<DocumentData | null>(null)
  const [img, setImg] = useState<any>({
    file: null,
    url: '',
  })

  const { currentUser } = useUserStore()
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore()

  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'chats', chatId as string), (res) => {
      setChat(res.data() ?? null)
    })
    return () => {
      unsub()
    }
  }, [chatId])

  const toggleOpenEmoji = () => {
    setOpenEmoji((prev) => !prev)
  }

  const handleEmoji = (e: EmojiClickData) => {
    setText((prev) => prev + e.emoji)
    setOpenEmoji(false)
  }

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setImg({
        file: e.target.files![0],
        url: URL.createObjectURL(e.target.files![0]),
      })
    }
  }

  const handleSend = async () => {
    if (text === '') return

    let imgUrl = null

    try {
      if (img.file) {
        imgUrl = await upload(img.file)
      }

      await updateDoc(doc(db, 'chats', chatId as string), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl ? { img: imgUrl } : {}),
        }),
      })

      const userIDs = [currentUser.id, user.id]

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, 'userchats', id)
        const userChatsSnapshot = await getDoc(userChatsRef)

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data()

          const chatIndex = userChatsData.chats.findIndex((c: any) => c.chatId === chatId)

          userChatsData.chats[chatIndex].lastMessage = text
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false
          userChatsData.chats[chatIndex].updatedAt = Date.now()

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          })
        }
      })
    } catch (error) {
      console.log(error)
    }

    setImg({
      file: null,
      url: '',
    })

    setText('')
  }

  return (
    <div className='chat'>
      <div className='top'>
        <div className='user'>
          <img src={user?.avatar || './avatar.png'} alt='avatar' />
          <div className='texts'>
            <span>{user.username}</span>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, consectetur!</p>
          </div>
        </div>
        <div className='icons'>
          <img src='./phone.png' alt='phone' />
          <img src='./video.png' alt='video' />
          <img src='./info.png' alt='info' />
        </div>
      </div>
      <div className='center'>
        {chat?.messages.map((message: any) => (
          <div
            className={message.senderId === currentUser.id ? 'message own' : 'message'}
            key={message?.createdAt}>
            <div className='texts'>
              {message.img && <img src={message.img} alt='image' />}
              <p>{message.text}</p>
              <span>1 min ago</span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className='message own'>
            <div className='texts'>
              <img src={img.url} alt='' />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className='bottom'>
        <div className='icons'>
          <label htmlFor='file'>
            <img src='./img.png' alt='image' />
          </label>
          <input type='file' id='file' style={{ display: 'none' }} onChange={handleImg} />
          <img src='./camera.png' alt='camera' />
          <img src='./mic.png' alt='mic' />
        </div>
        <input
          type='text'
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked ? 'You are blocked!' : 'Type a message...'
          }
          onChange={(e) => setText(e.target.value)}
          value={text}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className='emoji'>
          <img src='./emoji.png' alt='emoji' onClick={toggleOpenEmoji} />
          <div className='picker'>
            <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className='send-button'
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}>
          Send
        </button>
      </div>
    </div>
  )
}
export default chat
