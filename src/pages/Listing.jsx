import { db } from '../firebase.config'
import { doc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import shareIcon from '../assets/svg/shareIcon.svg'
import Spinner from '../components/Spinner'

const Listing = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [listing, setListing] = useState(null)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)

    const auth = getAuth()
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()) {
                setListing(docSnap.data())
                setIsLoading(false)
            }
        }

        fetchListing()
    }, [navigate, params.listingId])

    return (
        <div>Listing</div>
    )
}

export default Listing