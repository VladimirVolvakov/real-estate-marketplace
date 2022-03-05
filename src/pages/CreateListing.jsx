import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    const [geolocationEnabled, setGeolocationEnabled] = useState(true)
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

    const onSubmit = e => {
        e.preventDefault()
        console.log(formData)
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