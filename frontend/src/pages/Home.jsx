import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Home() {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <div className="card">
                    <h1>Welcome to the MERN CRUD App</h1>
                    <p>Designed with Redux Toolkit, JWT Authentication, and Clean Architecture.</p>

                    {user ? (
                        <div style={{ marginTop: '1rem' }}>
                            <p>Hello, <strong>{user.name}</strong>!</p>
                            <Link to="/profile" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                Go to Profile
                            </Link>
                        </div>
                    ) : (
                        <div style={{ marginTop: '1rem' }}>
                            <Link to="/login" className="btn btn-primary" style={{ marginRight: '1rem' }}>
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-secondary" style={{ backgroundColor: 'var(--text-secondary)', color: 'white' }}>
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
