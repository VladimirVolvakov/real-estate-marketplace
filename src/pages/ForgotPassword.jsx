import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import { toast } from 'react-toastify'
import { useState } from 'react'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    
    const onChange = e => setEmail(e.target.value)

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth()

            await sendPasswordResetEmail(auth, email)

            toast.success('Your password reset link has been sent')
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return (
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>Forgot Password</p>
            </header>

            <main>
                <form onSubmit={onSubmit}>
                    <input 
                        className='emailInput' 
                        id='email' 
                        onChange={onChange}
                        placeholder='Enter your email' 
                        type='email' 
                        value={email} 
                    />
                    <Link className='forgotPasswordLink' to='/sign-in'>
                        Sign In
                    </Link>

                    <div className='signInBar'>
                        <div className='signInText'>Send Reset Link</div>
                        <button className='signInButton'>
                            <ArrowRightIcon fill='#ffffff' height='34px' width='34px' />
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default ForgotPassword
