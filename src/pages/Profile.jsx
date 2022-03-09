import { db } from '../firebase.config'
import { getAuth, updateProfile } from 'firebase/auth'
import { toast } from 'react-toastify'
import { updateDoc,doc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

const Profile = () => {
    const auth = getAuth()

    const [changeDetails, setChangeDetails] = useState(false)

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const {name, email} = formData

    const navigate = useNavigate()

    const onChange = e => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onLogout = e => {
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                // Update name in Firebase:
                await updateProfile(auth.currentUser, {
                    displayName: name
                })

                // Update in Firestore:
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name
                })
            }
        } catch (error) {
            toast.error('Could not update profile details. Something went wrong...')
        }
    }

    return (
        <div className='profile'>
            <header className='profileHeader'>
                <p className='pageHeader'>My Profile</p>
                <button className='logOut' onClick={onLogout} type='button'>Log Out</button>
            </header>

            <main>
                <div className='profileDetailsHeader'>
                    <p className='profileDetailsText'>Personal Details</p>
                    <p className='changePersonalDetails' onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails(prevState => !prevState)
                    }}>
                        {changeDetails ? 'Done' : 'Change'}
                    </p>
                </div>

                <div className='profileCard'>
                    <form>
                        <input 
                            className={changeDetails ? 'profileNameActive' : 'profileName'} 
                            disabled={!changeDetails} 
                            id='name'
                            onChange={onChange}
                            type='text' 
                            value={name}
                        />

                        <input 
                            className={changeDetails ? 'profileEmailActive' : 'profileEmail'} 
                            disabled={!changeDetails} 
                            id='email'
                            onChange={onChange}
                            type='text' 
                            value={email}
                        />
                    </form>
                </div>

                <Link 
                    className='createListing'
                    to='/create-listing'
                >
                    <img 
                        alt='Home'
                        src={homeIcon} 
                    />
                    <p>Sell or rent your home</p>

                    <img 
                        alt='Arrow right'
                        src={arrowRight} 
                    />
                </Link>
            </main>
        </div>
    )
}

export default Profile
