import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
    const { user } = useSelector((state) => state.auth);

    // If we have a user (verified by login/restore), render child routes
    // For refresh token flow, we might need a "loading" state check if we are verifying session on load.
    // For now assuming if user is null, they need to login.
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
