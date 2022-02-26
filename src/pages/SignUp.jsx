import { useState } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const { name, email, password } = formData

    const navigate = useNavigate()

    const onChange = e => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth()

            const userCredential = await createUserWithEmailAndPassword(auth, email, password)

            const user = userCredential.user

            updateProfile(auth.currentUser, {
                displayName: name
            })

            const formDataCopy = { ...formData }
            delete formDataCopy.password
            formDataCopy.timestamp = serverTimestamp()

            await setDoc(doc(db, 'users', user.uid), formDataCopy)

            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='pageContainer'>
                <header>
                    <p className='pageHeader'>
                        Welcome Back!
                    </p>
                </header>

                <main>
                    <form onSubmit={onSubmit}>
                        <input 
                            className='nameInput' 
                            id='name'
                            onChange={ onChange }
                            placeholder='Enter your name' 
                            type='text' 
                            value={ name }
                        />
                        
                        <input 
                            className='emailInput' 
                            id='email'
                            onChange={ onChange }
                            placeholder='Enter your email' 
                            type='email' 
                            value={ email }
                        />

                        <div className='passwordInputDiv'>
                            <input 
                                className='passwordInput'
                                id='password'
                                onChange={ onChange }
                                placeholder='Enter your password'
                                type={ showPassword ? 'text' : 'password' } 
                                value={ password}
                            />

                            <img 
                                alt='Show password' 
                                className='showPassword'
                                onClick={() => setShowPassword(!showPassword)}
                                src={ visibilityIcon }  
                            />
                        </div>

                        <Link 
                            className='forgotPasswordLink' 
                            to='/forgot-password'
                        >
                            Forgot password? Click here
                        </Link>

                        <div className='signUpBar'>
                            <p className='signUpText'>
                                Sign Up
                            </p>
                            <button className='signUpButton'>
                                <ArrowRightIcon 
                                    fill='#ffffff'
                                    height='34px'
                                    width='34px'
                                />
                            </button>
                        </div>
                    </form>
                </main>

                {/* Google OAuth */}

                <Link 
                    className='registerLink'
                    to='/sign-in'
                >
                    Sign In
                </Link>
            </div>
        </>
    )
}

export default SignUp
