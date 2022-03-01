import { db } from '../firebase.config'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import googleIcon from '../assets/svg/googleIcon.svg'

const OAuth = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            // Check for user:
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            // If user doesn't exist, create user:
            if (!docSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }

            navigate('/')
        } catch (error) {
            toast.error('Could not authorize with Google. Something went wrong...')
        }
    }

    return (
        <div className='socialLogin'>
            <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in' } with </p>
            <button className='socialIconDiv' onClick={ onGoogleClick }>
                <img alt='Google OAuth' className='socialIconImg' src={ googleIcon } />
            </button>
        </div>
    )
}

export default OAuth