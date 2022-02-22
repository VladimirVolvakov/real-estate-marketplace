import { useState } from 'react'
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

    return (
        <>
            <div className='pageContainer'>
                <header>
                    <p className='pageHeader'>
                        Welcome Back!
                    </p>
                </header>

                <main>
                    <form>
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
