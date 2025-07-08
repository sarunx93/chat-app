import { useState, useRef, useEffect } from 'react'
import './chat.css'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { doc, DocumentData, onSnapshot } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore'

const chat = () => {
  const [openEmoji, setOpenEmoji] = useState<boolean>(false)
  const [text, setText] = useState<string>('')
  const [chat, setChat] = useState<DocumentData | null>(null)

  const {chatId} = useChatStore()

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

  return (
    <div className='chat'>
      <div className='top'>
        <div className='user'>
          <img src='./avatar.png' alt='avatar' />
          <div className='texts'>
            <span>Jane Doe</span>
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
        <div className='message'>
          <img src='./avatar.png' alt='' />
          <div className='texts'>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio iusto laborum
              debitis vitae aliquid deleniti officiis quae, repudiandae iste numquam.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message own'>
          <div className='texts'>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio iusto laborum
              debitis vitae aliquid deleniti officiis quae, repudiandae iste numquam.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message'>
          <img src='./avatar.png' alt='' />
          <div className='texts'>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio iusto laborum
              debitis vitae aliquid deleniti officiis quae, repudiandae iste numquam.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message own'>
          <div className='texts'>
            <img
              src='https://www.kkday.com/th/blog/wp-content/uploads/Alt-om-rejsen-til-Thailand-artikler-og-rejsetilbud-1.jpg'
              alt=''
            />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio iusto laborum
              debitis vitae aliquid deleniti officiis quae, repudiandae iste numquam.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className='message'>
          <img src='./avatar.png' alt='' />
          <div className='texts'>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio iusto laborum
              debitis vitae aliquid deleniti officiis quae, repudiandae iste numquam.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div ref={endRef}></div>
      </div>
      <div className='bottom'>
        <div className='icons'>
          <img src='./img.png' alt='image' />
          <img src='./camera.png' alt='camera' />
          <img src='./mic.png' alt='mic' />
        </div>
        <input
          type='text'
          placeholder='Type a message...'
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className='emoji'>
          <img src='./emoji.png' alt='emoji' onClick={toggleOpenEmoji} />
          <div className='picker'>
            <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className='send-button'>Send</button>
      </div>
    </div>
  )
}
export default chat
