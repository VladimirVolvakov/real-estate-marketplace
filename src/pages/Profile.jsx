import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Profile = () => {
    const auth = getAuth()

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const { name, email } = formData

    const navigate = useNavigate()

    const onLogout = e => {
        auth.signOut()
        navigate('/')
    }

    return (
        // user ? <h1>{ user.displayName }</h1> : 'Please Log In'
        <div className='profile'>
            <header className='profileHeader'>
                <p className='pageHeader'>My Profile</p>
                <button className='logOut' onClick={onLogout} type='button'>Log Out</button>
            </header>
        </div>
    )
}

export default Profile
