import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ListingItem from '../components/ListingItem'
import Spinner from '../components/Spinner'

const Offer = () => {
    const [listings, setListings] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // Get a reference:
                const listingsRef = collection(db, 'listings')

                // Create a query:
                const q = query(
                    listingsRef, 
                    where('offer', '==', true), 
                    orderBy('timestamp', 'desc'), 
                    limit(10)
                )

                // Execute a query:
                const querySnap = await getDocs(q)

                const listings = []

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings)
                setIsLoading(false)
            } catch (error) {
                toast.error('Could not get data from the database...')                
            }
        }

        fetchListings()
    }, [])

    return (
        <div className='category'>
            <header>
                <p className='pageHeader'>
                    Offers
                </p>
            </header>

            { isLoading
                ? <Spinner />
                : listings && listings.length > 0
                    ? (
                        <>
                            <main>
                                <ul className='categoryListings'>
                                    { listings.map(listing => (
                                        <ListingItem 
                                            id={ listing.id }
                                            key={ listing.id }
                                            listing={ listing.data } 
                                        />
                                    )) }
                                </ul>
                            </main>
                        </>
                    )
                    : <p>There are no current offers</p>
            }
        </div>
    )
}

export default Offer
