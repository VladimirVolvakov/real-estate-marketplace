import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { email, password } = formData

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

            const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
            if (userCredential.user) {
                navigate('/')
            }            
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

                        <div className='signInBar'>
                            <p className='signInText'>
                                Sign In
                            </p>
                            <button className='signInButton'>
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
                    to='/sign-up'
                >
                    Sign Up
                </Link>
            </div>
        </>
    )
}

export default SignIn
