import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Category from './pages/Category'
import CreateListing from './pages/CreateListing'
import Explore from './pages/Explore'
import ForgotPassword from './pages/ForgotPassword'
import Navbar from './components/Navbar'
import Offer from './pages/Offer'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/offers' element={<Offer />} />
          <Route path='/category/:categoryName' element={<Category />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/create-listing' element={<CreateListing />} />
        </Routes>
        <Navbar />
      </Router>

      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App
