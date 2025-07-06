import { auth } from '../../lib/firebase'
import './detail.css'

const Detail = () => {
  return (
    <div className='detail'>
      <div className='user'>
        <img src='./avatar.png' alt='' />
        <h2>Jane Doe</h2>
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
        <button>Block User</button>
        <button className='logout' onClick={() => auth.signOut()}>
          Log out
        </button>
      </div>
    </div>
  )
}
export default Detail
