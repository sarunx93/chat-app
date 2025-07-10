import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { useChatStore } from '../../lib/chatStore'
import { auth, db } from '../../lib/firebase'
import { useUserStore } from '../../lib/userStore'
import './detail.css'

const Detail = () => {
  const { chatId, user, isCurrnetUserBlocked, isReceiverBlocked, changeBlock } = useChatStore()
  const { currentUser } = useUserStore()
  const handleBlock = async () => {
    if (!user) return

    const userDocRef = doc(db, ' users', currentUser.id)

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      })
      changeBlock()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='detail'>
      <div className='user'>
        <img src={user?.avatar || './avatar.png'} alt='' />
        <h2>{user.username}</h2>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
      </div>
      <div className='info'>
        <div className='option'>
          <div className='title'>
            <span>Chat Setting</span>
            <img src='./arrowUp.png' alt='' />
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Privacy % help</span>
            <img src='./arrowUp.png' alt='' />
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Shared Photos</span>
            <img src='./arrowDown.png' alt='' />
          </div>
          <div className='photos'>
            <div className='photo-item'>
              <div className='photo-detail'>
                <img
                  src='https://www.kkday.com/th/blog/wp-content/uploads/Alt-om-rejsen-til-Thailand-artikler-og-rejsetilbud-1.jpg'
                  alt=''
                />
                <span>maekampong.png</span>
              </div>

              <img src='./download.png' alt='download' className='icon' />
            </div>
            <div className='photo-item'>
              <div className='photo-detail'>
                <img
                  src='https://www.kkday.com/th/blog/wp-content/uploads/Alt-om-rejsen-til-Thailand-artikler-og-rejsetilbud-1.jpg'
                  alt=''
                />
                <span>maekampong.png</span>
              </div>

              <img src='./download.png' alt='download' className='icon' />
            </div>
            <div className='photo-item'>
              <div className='photo-detail'>
                <img
                  src='https://www.kkday.com/th/blog/wp-content/uploads/Alt-om-rejsen-til-Thailand-artikler-og-rejsetilbud-1.jpg'
                  alt=''
                />
                <span>maekampong.png</span>
              </div>

              <img src='./download.png' alt='download' className='icon' />
            </div>
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Shared Files</span>
            <img src='./arrowUp.png' alt='' />
          </div>
        </div>
        <button>
          {isCurrnetUserBlocked
            ? 'You are blocked.'
            : isReceiverBlocked
            ? 'User blocked'
            : 'Block User'}
        </button>
        <button className='logout' onClick={() => auth.signOut()}>
          Log out
        </button>
      </div>
    </div>
  )
}
export default Detail
