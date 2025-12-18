import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container">
                <Link to="/" className="logo">MERN App</Link>
                <nav className="nav-links">
                    {user ? (
                        <>
                            {user.role !== 'admin' && (
                                <Link to="/profile">Profile</Link>
                            )}
                            {user.role === 'admin' && (
                                <Link to="/admin">Admin Dashboard</Link>
                            )}
                            <button className="btn btn-primary" onClick={onLogout} style={{ marginLeft: '1rem' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
