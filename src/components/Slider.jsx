import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase.config'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import SwiperCore, { A11y, Navigation, Pagination, Scrollbar } from 'swiper'
import 'swiper/swiper-bundle.css'

SwiperCore.use([A11y, Navigation, Pagination, Scrollbar])

const Slider = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchListings = async () => {
            // Create a collection reference:
            const listingsRef = collection(db, 'listings')

            // Create a query:
            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))

            // Get a query snapshot:
            const querySnap = await getDocs(q)

            // Initialize a value:
            let listings = []

            // Loop through a query snapshot:
            querySnap.forEach(doc => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            
            // Set new value of listings:
            setListings(listings)

            setIsLoading(false)
        }

        fetchListings()
    }, [])

    if (isLoading) {
        return <Spinner />
    }

    if (listings.length === 0) {
        return <></>
    }
    
    return listings && (
        <>
            <p className='exploreHeading'>Recommended</p>

            <Swiper pagination={{clickable: true}} slidesPerView={1}>
                { listings.map(({data, id}) => (
                    <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                        <div 
                            className='swiperSlideDiv' 
                            style={{
                                background: `url(${data.imgUrls[0]})
                                    center 
                                    no-repeat`, 
                                    backgroundSize: 'cover'
                            }}
                        >
                            <p className='swiperSlideText'>{data.name}</p>
                            <p className='swiperSlidePrice'>${data.discountedPrice ?? data.regularPrice} { data.type === 'rent' ? '/ month' : ''}</p>
                        </div>
                    </SwiperSlide>
                )) }
            </Swiper>
        </>
    )
}

export default Slider