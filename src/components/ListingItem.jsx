import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'

const ListingItem = ({ listing, id, onDelete }) => {
    return (
        <li className='categoryListing'>
            <Link 
                className='categoryListingLink'
                to={`/category/${listing.type}/${id}`}
            >
                <img 
                    alt={listing.name} 
                    className='categoryListingImg' 
                    src={listing.imgUrls[0]} 
                />

                <div className='categoryListingDetails'>
                    <p className='categoryListingLocation'>
                        {listing.location}
                    </p>

                    <p className='categoryListingName'>
                        {listing.name}
                    </p>

                    <p className='categoryListingPrice'>
                        ${listing.offer 
                            ? listing.discountedPrice 
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : listing.regularPrice 
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        {listing.type === 'rent' && ' / month'}
                    </p>

                    <div className='categoryListingInfoDiv'>
                        <img alt='bed' src={bedIcon} />
                        <p className='categoryListingInfoText'>
                            {listing.bedrooms > 1
                                ? `${listing.bedrooms} bedrooms`
                                : '1 bedroom'
                            }
                        </p>

                        <img alt='bath' src={bathtubIcon} />
                        <p className='categoryListingInfoText'>
                            {listing.bathrooms > 1
                                ? `${listing.bathrooms} bathrooms`
                                : '1 bathroom'
                            }
                        </p>
                    </div>
                </div>
            </Link>

            {onDelete && (
                <DeleteIcon 
                    className='removeIcon' 
                    fill='rgb(231, 76, 60)' 
                    onClick={() => onDelete(listing.id, listing.name)}
                />
            )}
        </li>
    )
}

export default ListingItem
