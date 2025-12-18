import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';

function AdminLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess && user) {
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                toast.error('Access denied. Admin privileges required.');
                dispatch(reset());
            }
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const validateEmail = (value) => {
        if (!value) {
            return 'Email is required';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Please provide a valid email address';
        }
        return '';
    };

    const validatePassword = (value) => {
        if (!value) {
            return 'Password is required';
        }
        return '';
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        let error = '';
        if (name === 'email') {
            error = validateEmail(value);
        } else if (name === 'password') {
            error = validatePassword(value);
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        setErrors({
            email: emailError,
            password: passwordError
        });

        if (emailError || passwordError) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        const userData = {
            email,
            password,
        };

        dispatch(login(userData));
    };

    if (isLoading) {
        return <div className="container">Loading...</div>;
    }

    return (
        <div className="container">
            <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
                <div className="card">
                    <section className="heading">
                        <h1>Admin Login</h1>
                        <p>Access admin dashboard</p>
                    </section>

                    <section className="form">
                        <form onSubmit={onSubmit}>
                            <div className="form-group">
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'error' : ''}`}
                                    id="email"
                                    name="email"
                                    value={email}
                                    placeholder="Enter admin email"
                                    onChange={onChange}
                                    required
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'error' : ''}`}
                                    id="password"
                                    name="password"
                                    value={password}
                                    placeholder="Enter admin password"
                                    onChange={onChange}
                                    required
                                />
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-block">
                                    Login as Admin
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
