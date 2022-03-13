import { db } from '../firebase.config'
import { doc, getDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Spinner from '../components/Spinner'

const Contact = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState('')

    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams()
    const params = useParams()

    useEffect(() => {
        const getLandlord = async () => {
            const docRef = doc(db, 'users', params.landlordId)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()) {
                setLandlord(docSnap.data())
                setIsLoading(false)
            } else {
                toast.error('Could not find landlord data')
            }
        }

        getLandlord()
    }, [params.landlordId])

    if (isLoading) {
        return <Spinner />
    }

    const onChange = e => setMessage(e.target.value)

    return (
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>Contact landlord</p>
            </header>

            { landlord !== null && (
                <main>
                    <div className='contactLandlord'>
                        <p className='landlordName'>{landlord?.name}</p>
                    </div>

                    <form className='messageForm'>
                        <div className='messageDiv'>
                            <label htmlFor='message' className='messageLabel'>Message</label>
                        
                            <textarea className='textarea' id='message' name='message' onChange={onChange} value={message}></textarea>
                        </div>

                        <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                            <button className='primaryButton' type='button'>Send message</button>
                        </a>
                    </form>
                </main>
            ) }
        </div>
    )
}

export default Contact