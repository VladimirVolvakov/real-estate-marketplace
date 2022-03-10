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

    if (isLoading) {
        return <Spinner />
    }

    return (
        <main>
            {/* Slider */}

            <div className='shareIconDiv' onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setShareLinkCopied(true)
                setTimeout(() => {
                    setShareLinkCopied(false)
                }, 2000)
            }}>
                <img alt='Share' src={shareIcon} />
            </div>

            {shareLinkCopied && <p className='linkCopied'>Link copied</p>}
            
            <div className='listingDetails'>
                <p className='listingName'>
                    { listing.name } - ${ listing.offer 
                        ? listing.discountedPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
                        : listing.regularPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
                    }
                </p>

                <p className='listingLocation'>
                    { listing.location }
                </p>

                <p className='listingType'>
                    For { listing.type === 'rent' ? 'Rent' : 'Sale' }
                </p>

                { listing.offer && (
                    <p className='discountPrice'>
                        ${listing.regularPrice - listing.discountedPrice} discount
                    </p>
                ) }

                <ul className='listingDetailsList'>
                    <li>
                        { listing.bedrooms > 1 
                            ? `${listing.bedrooms} bedrooms` 
                            : '1 bedroom'
                        }
                    </li>

                    <li>
                        { listing.bathrooms > 1 
                            ? `${listing.bathrooms} bathrooms` 
                            : '1 bathroom'
                        }
                    </li>

                    <li>
                        { listing.parking && 'Parking spot' }
                    </li>

                    <li>
                        { listing.furnished && 'Furnished' }
                    </li>
                </ul>

                <p className='listingLocationTitle'>Location</p>

                {/* Map */}

                { auth.currentUser?.uid !== listing.userRef && (
                    <Link className='primaryButton' to={`/contact/${listing.userRef}?listingName=S{listing.name}`}>
                        Contact landlord
                    </Link>
                ) }
            </div>
        </main>
    )
}

export default Listing