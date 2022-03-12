import { db } from '../firebase.config'
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { getAuth, updateProfile } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'

const Profile = () => {
    const auth = getAuth()

    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })
    const [isLoading, setIsLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const {name, email} = formData

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserListings = async () => {
            // Create a reference:
            const listingsRef = collection(db, 'listings')

            // Create a query (we get listings in descending timestamp order when userRef is equal to logged in user):
            const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))

            // Get a query snapshot:
            const querySnap = await getDocs(q)

            // Initialize a value:
            let listings = []

            // Fill in the listings array with found docs:
            querySnap.forEach(doc => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            // Set new value of listings array:
            setListings(listings)

            setIsLoading(false)
        }

        fetchUserListings()
    }, [auth.currentUser.uid])

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

    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            // Delete document with id = listingId:
            await deleteDoc(doc(db, 'listings', listingId))
            // Update initial listings:
            const updatedListings = listings.filter(listing => listing.id !== listingId)
            // Set listings equal to updated listings:
            setListings(updatedListings)
            // Tell everything went correct:
            toast.success('Listing deleted successfully')
        }
    }

    const onEdit = listingId => navigate(`/edit-listing/${listingId}`)

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

                { !isLoading && listings?.length > 0 && (
                    <>
                        <p className='listingText'>Your listings</p>
                        <ul className='listingsList'>
                            { listings.map(listing => (
                                <ListingItem 
                                    id={listing.id}
                                    key={listing.id}
                                    listing={listing.data}
                                    onDelete={() => onDelete(listing.id)}
                                    onEdit={() => onEdit(listing.id)}
                                />
                            )) }
                        </ul>
                    </>
                ) }
            </main>
        </div>
    )
}

export default Profile
