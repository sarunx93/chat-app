import { useState } from 'react'
import './login.css'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import upload from '../../lib/upload'
import { ImageFileType } from '../../types'


const Login = () => {
  const [avatar, setAvatar] = useState<ImageFileType>({
    file: null,
    url: '',
  })

  const [loading, setLoading] = useState(false)

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatar({
        file: e.target.files![0],
        url: URL.createObjectURL(e.target.files![0]),
      })
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const { email, password } = Object.fromEntries(formData)

    try {
      await signInWithEmailAndPassword(auth, email as string, password as string)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target as HTMLFormElement
    const formData = new FormData(e.target as HTMLFormElement)
    const { username, email, password } = Object.fromEntries(formData)

    try {
      const res = await createUserWithEmailAndPassword(auth, email as string, password as string)
      const imgUrl = await upload(avatar.file as File)

      await setDoc(doc(db, 'users', res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      })

      await setDoc(doc(db, 'userchats', res.user.uid), {
        chats: [],
      })
      form.reset()
      toast.success('Account Created.')
      setAvatar({ file: null, url: '' })
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login'>
      <div className='item'>
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input type='text' placeholder='Email' name='email' />
          <input type='password' placeholder='Password' name='password' />
          <button disabled={loading}>Sign In</button>
        </form>
      </div>
      <div className='separator'></div>
      <div className='item'>
        <h2>Create an account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor='file'>
            <img src={avatar.url || './avatar.png'} alt='avatar' />
            Upload an image
          </label>
          <input type='file' id='file' style={{ display: 'none' }} onChange={handleAvatar} />
          <input type='text' placeholder='Username' name='username' />
          <input type='text' placeholder='Email' name='email' />
          <input type='password' placeholder='Password' name='password' />
          <button disabled={loading}>Sign Up</button>
        </form>
      </div>
    </div>
  )
}
export default Login
