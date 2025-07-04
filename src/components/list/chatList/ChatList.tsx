import { useState } from 'react'
import './chatList.css'

const ChatList = () => {
  const [addMode, setAddmode] = useState<boolean>(false)

  const toggleAddMode = () => {
    setAddmode((prev) => !prev)
  }

  return (
    <div className='chat-list'>
      <div className='search'>
        <div className='search-bar'>
          <img src='/search.png' alt='search' />
          <input type='text' placeholder='search' />
        </div>
        <img
          src={addMode ? './minus.png' : './plus.png'}
          alt='plus button'
          className='add'
          onClick={toggleAddMode}
        />
      </div>
      <div className='item'>
        <img src='./avatar.png' alt='' />
        <div className='texts'>
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
      <div className='item'>
        <img src='./avatar.png' alt='' />
        <div className='texts'>
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
      <div className='item'>
        <img src='./avatar.png' alt='' />
        <div className='texts'>
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
      <div className='item'>
        <img src='./avatar.png' alt='' />
        <div className='texts'>
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
    </div>
  )
}
export default ChatList
