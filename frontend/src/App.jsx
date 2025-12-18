import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAccessToken, logoutUserLocal, verifyAuth } from './features/auth/authSlice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch]);

  useEffect(() => {
    const handleTokenRefresh = (event) => {
      dispatch(updateAccessToken(event.detail));
    };

    const handleForceLogout = () => {
      dispatch(logoutUserLocal());
    };

    window.addEventListener('tokenRefreshed', handleTokenRefresh);
    window.addEventListener('forceLogout', handleForceLogout);

    return () => {
      window.removeEventListener('tokenRefreshed', handleTokenRefresh);
      window.removeEventListener('forceLogout', handleForceLogout);
    };
  }, [dispatch]);

  if (!isAuthChecked) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
