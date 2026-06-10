import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import ThemeToggle from './components/ThemeToggle';

function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to='/sign-in' replace />;
  }

  if (currentUser.isAdmin !== true) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className='min-h-screen flex flex-col'>
        <Header />

        <ThemeToggle />

        <div className='flex-1'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/about' element={<About />} />
            <Route path='/search' element={<Search />} />
            <Route path='/listing/:listingId' element={<Listing />} />

            <Route element={<PrivateRoute />}>
              <Route path='/profile' element={<Profile />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path='/create-listing' element={<CreateListing />} />
              <Route
                path='/update-listing/:listingId'
                element={<UpdateListing />}
              />
            </Route>
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}