import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'

const Explore = () => {
    return (
        <div className='explore'>
            <header>
                <p className='pageHeader'>Explore</p>
            </header>

            <main>
                {/* Slider */}

                <p className='exploreCategoryHeading'>Categories</p>
                <div className='exploreCategories'>
                    <Link to='/category/rent'>
                        <img 
                            alt='Rent' 
                            className='exploreCategoryImg' 
                            src={ rentCategoryImage } 
                        />
                        <p className='exploreCategoryName'>Real estate for rent</p>
                    </Link>
                    <Link to='/category/sale'>
                        <img 
                            alt='Sell' 
                            className='exploreCategoryImg' 
                            src={ sellCategoryImage } 
                        />
                        <p className='exploreCategoryName'>Real estate for sale</p>
                    </Link>
                </div>
            </main>
        </div>
    )
}

export default Explore
