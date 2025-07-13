import { arrayRemove, arrayUnion, doc, updateDoc, getDoc } from 'firebase/firestore'
import { useChatStore } from '../../lib/chatStore'
import { auth, db } from '../../lib/firebase'
import { useUserStore } from '../../lib/userStore'
import './detail.css'
import { useEffect, useState } from 'react'
import { ImageFileType } from '../../types'

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore()
  const { currentUser } = useUserStore()

  const [sharedImages, setSharedImages] = useState<ImageFileType[]>([])
  const [showSharedImages, setShowSharedImages] = useState<boolean>(false)

  const handleBlock = async () => {
    if (!user) return

    const userDocRef = doc(db, 'users', currentUser?.id as string)

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      })
      changeBlock()
    } catch (error) {
      console.log(error)
    }
  }

  const getSharedImages = async () => {
    try {
      const docRef = doc(db, 'chats', chatId as string)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const { messages } = docSnap.data()
        const sharedImg = messages.filter((message: any) => message.img)
        setSharedImages(sharedImg)
      } else {
        console.error('Such document does not exist.')
      }
    } catch (error) {
      console.error(error)
    }
  }

  //getting images to display in 'shared images' section
  useEffect(() => {
    getSharedImages()
  }, [sharedImages])

  return (
    <div className='detail'>
      <div className='user'>
        <img src={user?.avatar || './avatar.png'} alt='' />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
      </div>
      <div className='info'>
        <div className='option'>
          <div className='title'>
            <span>Chat Setting</span>
            <button className='arrow-btn'>
              <img src='./arrowUp.png' alt='' />
            </button>
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Privacy % help</span>
            <button className='arrow-btn'>
              <img src='./arrowUp.png' alt='' />
            </button>
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Shared Photos</span>
            <button onClick={() => setShowSharedImages((prev) => !prev)} className='arrow-btn'>
              <img src={showSharedImages ? './arrowUp.png' : './arrowDown.png'} alt='' />
            </button>
          </div>
          {showSharedImages && (
            <div className='photos'>
              {sharedImages.map((img, index) => {
                return (
                  <div className='photo-item'>
                    <div className='photo-detail'>
                      <img src={img.img} alt='' />
                      <span>{`Image-${index + 1}`}</span>
                    </div>

                    <img src='./download.png' alt='download' className='icon' />
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className='option'>
          <div className='title'>
            <span>Shared Files</span>
            <button className='arrow-btn'>
              <img src='./arrowUp.png' alt='' />
            </button>
          </div>
        </div>
        <button onClick={handleBlock} className='red-btn'>
          {isCurrentUserBlocked
            ? 'You are blocked.'
            : isReceiverBlocked
            ? 'User blocked'
            : 'Block User'}
        </button>
        <button className='red-btn logout' onClick={() => auth.signOut()}>
          Log out
        </button>
      </div>
    </div>
  )
}
export default Detail
