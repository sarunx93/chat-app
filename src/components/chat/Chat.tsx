import { useState } from 'react'
import './chat.css'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'

const chat = () => {
  const [openEmoji, setOpenEmoji] = useState<boolean>(false)
  const [text, setText] = useState<string>('')

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
      <div className='center'></div>
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
