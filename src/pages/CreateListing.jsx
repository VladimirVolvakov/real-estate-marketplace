import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { toast } from 'react-toastify'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Spinner from '../components/Spinner'

const CreateListing = () => {
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    })
    const [geolocationEnabled, setGeolocationEnabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { type, name, bedrooms, bathrooms, parking, furnished, address, offer, regularPrice, discountedPrice, images, latitude, longitude } = formData
    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({ ...formData, userRef: user.uid })
                } else {
                    navigate('/sign-in')
                }
            })
        }

        return () => {
            isMounted.current = false
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted])

    const onMutate = e => {
        let boolean = null
        
        if (e.target.value === 'true') {
            boolean = true
        }

        if (e.target.value === 'false') {
            boolean = false
        }

        // Files:
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState, 
                images: e.target.files
            }))
        }

        // Text / booleans / numbers:
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        setIsLoading(true)

        // Check if discounted price is less than regular price:
        if (discountedPrice >= regularPrice) {
            setIsLoading(false)
            toast.error('Discounted price can not be equal or greater than regular price')
            return
        }

        // Check the number if downloaded images:
        if (images.length > 6) {
            setIsLoading(false)
            toast.error('Max 6 images can be downloaded')
            return
        }

        // Geocoding:
        let geolocation = {}
        let location

        if (geolocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`)

            const data = await response.json()

            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0

            location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address

            if (location === undefined || location.includes('undefined')) {
                setIsLoading(false)
                toast.error('Incorrect address')
                return
            }
        } else {
            geolocation.lat = latitude
            geolocation.lng = longitude
        }

        // Store an image in Firebase:
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

                const storageRef = ref(storage, 'images/' + fileName)

                const uploadTask = uploadBytesResumable(storageRef, image)

                uploadTask.on('state_changed', 
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        console.log('Upload is ' + progress + '% done')
                        // eslint-disable-next-line default-case
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused')
                                break
                            case 'running':
                                console.log('Upload is running')
                                break
                        }
                    }, 
                    (error) => {
                        reject(error)
                    }, 
                    () => {
                        // Handle successful uploads on complete:
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL)
                        })
                    }
                )
            })
        }

        // Store all images:
        const imgUrls = await Promise.all(
            [...images].map(image => storeImage(image))
        )
            .catch(() => {
                setIsLoading(false)
                toast.error('Images are not uploaded...')
                return
            })
        
        // Get all the entered data to an object
        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp()
        }

        // Delete excessive data from an object:
        formDataCopy.location = address
        delete formDataCopy.images
        delete formDataCopy.address
        !formDataCopy.offer && delete formDataCopy.discountedPrice

        // Add object to Firestore:
        const docRef = await addDoc(collection(db, 'listings'), formDataCopy)

        setIsLoading(false)

        // Tell the user about operation success and navigate to new listing:
        toast.success('Your real estate object saved')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    if (isLoading) {
        return <Spinner />
    }
    
    return (
        <div className='profile'>
            <header>
                <p className='pageHeader'>Create a new listing</p>
            </header>

            <main>
                <form onSubmit={ onSubmit }>
                    <label className='formLabel'>Sell / Rent</label>
                    <div className='formButtons'>
                        <button 
                            className={ type === 'sale' ? 'formButtonActive' : 'formButton' } 
                            id='type' 
                            onClick={ onMutate }
                            type='button'
                            value='sale'
                        >
                            Sell
                        </button>

                        <button 
                            className={ type === 'rent' ? 'formButtonActive' : 'formButton' } 
                            id='type' 
                            onClick={ onMutate }
                            type='button'
                            value='rent'
                        >
                            Rent
                        </button>
                    </div>

                    <label className='formLabel'>Name</label>
                    <input 
                        className='formInputName' 
                        id='name'
                        maxLength='32'
                        minLength='10'
                        onChange={ onMutate }
                        required
                        type='text' 
                        value={ name }
                    />
                

                <div className='formRooms flex'>
                    <div>
                        <label className='formLabel'>Bedrooms</label>
                        <input 
                            className='formInputSmall' 
                            id='bedrooms'
                            max='50'
                            min='1'
                            onChange={ onMutate }
                            required
                            type='number' 
                            value={ bedrooms }
                        />  
                    </div>

                    <div>
                        <label className='formLabel'>Bathrooms</label>
                        <input 
                            className='formInputSmall' 
                            id='bathrooms'
                            max='50'
                            min='1'
                            onChange={ onMutate }
                            required
                            type='number' 
                            value={ bathrooms }
                        />
                    </div>
                </div>

                <label className='formLabel'>Parking spot</label>
                <div className='formButtons'>
                    <button 
                        className={ parking ? 'formButtonActive' : 'formButton' } 
                        id='parking' 
                        max='50'
                        min='1'
                        onClick={ onMutate }
                        type='button'
                        value={ true }
                    >
                        Yes
                    </button>

                    <button 
                        className={ !parking && parking !== null ? 'formButtonActive' : 'formButton' } 
                        id='parking' 
                        onClick={ onMutate }
                        type='button'
                        value={ false }
                    >
                        No
                    </button>
                </div>

                <label className='formLabel'>Furnished</label>
                <div className='formButtons'>
                    <button 
                        className={ furnished ? 'formButtonActive' : 'formButton' } 
                        id='furnished' 
                        onClick={ onMutate }
                        type='button'
                        value={ true }
                    >
                        Yes
                    </button>

                    <button 
                        className={ !furnished && furnished !== null ? 'formButtonActive' : 'formButton' } 
                        id='furnished' 
                        onClick={ onMutate }
                        type='button'
                        value={ false }
                    >
                        No
                    </button>
                </div>

                <label className='formLabel'>Address</label>
                <textarea 
                    className='formInputAddress'
                    id='address'
                    onChange={ onMutate }
                    required
                    type='text'
                    value={ address }
                />

                { !geolocationEnabled && (
                    <div className='formLatLng flex'>
                        <div>
                            <label className='formLabel'>Latitude</label>
                            <input 
                                className='formInputSmall' 
                                id='latitude'
                                onChange={ onMutate }
                                required
                                type='number'
                                value={ latitude }
                            />
                        </div>

                        <div>
                            <label className='formLabel'>Longitude</label>
                            <input 
                                className='formInputSmall' 
                                id='longitude'
                                onChange={ onMutate }
                                required
                                type='number'
                                value={ longitude }
                            />
                        </div>
                    </div>
                ) }

                <label className='formLabel'>Offer</label>
                <div className='formButtons'>
                    <button 
                        className={ offer ? 'formButtonActive' : 'formButton' } 
                        id='offer' 
                        onClick={ onMutate }
                        type='button'
                        value={ true }
                    >
                        Yes
                    </button>

                    <button 
                        className={ !offer && offer !== null ? 'formButtonActive' : 'formButton' } 
                        id='offer' 
                        onClick={ onMutate }
                        type='button'
                        value={ false }
                    >
                        No
                    </button>
                </div>

                <label className='formLabel'>Regular price</label>
                <div className='formPriceDiv'>
                    <input 
                        className='formInputSmall' 
                        id='regularPrice'
                        max='75000000'
                        min='50'
                        onChange={ onMutate }
                        required
                        type='number'
                        value={ regularPrice }
                    />
                    { type === 'rent' && (
                        <p className='formPriceText'>$ / month</p>
                    ) }
                </div>

                { offer && (
                    <>
                        <label className='formLabel'>Discounted price</label>
                        <input 
                            className='formInputSmall' 
                            id='discountedPrice'
                            max='75000000'
                            min='50'
                            onChange={ onMutate }
                            required={ offer }
                            type='number'
                            value={ discountedPrice }
                        />
                    </>
                ) }

                <label className='formLabel'>Images</label>
                <p className='imagesInfo'>The first downloaded image (max. 6) will be the cover.</p>
                <input 
                    accept='.jpg,.png,.jpeg'
                    className='formInputFile' 
                    id='images'
                    max='6'
                    multiple
                    onChange={ onMutate }
                    required
                    type='file'
                />

                <button 
                    className='primaryButton createListingButton'
                    type='submit'
                >
                    Create listing    
                </button>
                </form>
            </main>
        </div>
    )
}

export default CreateListing