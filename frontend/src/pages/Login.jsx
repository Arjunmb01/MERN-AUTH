import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import '../styles/AuthPages.css';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
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

        if (isSuccess || user) {
            navigate('/');
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

        const userData = {
            email,
            password,
        };

        dispatch(login(userData));
    };

    if (isLoading) {
        return <div className="auth-loading">Loading...</div>;
    }

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="gradient-bg"></div>
                <div className="auth-left-content">
                    <p className="quote-label">A WISE QUOTE</p>
                    <h1 className="auth-title">
                        Get<br />
                        Everything<br />
                        You Want
                    </h1>
                    <p className="auth-subtitle">
                        You can get everything you want if you work hard,<br />
                        trust the process, and stick to the plan.
                    </p>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-form-container">
                    <div className="brand-logo">🔐 MERN App</div>

                    <h2 className="welcome-title">Welcome Back</h2>
                    <p className="welcome-subtitle">Enter your email and password to access your account</p>

                    <form onSubmit={onSubmit} className="auth-form">
                        <div className="form-field">
                            <label>Email</label>
                            <input
                                type="email"
                                className={`modern-input ${errors.email ? 'input-error' : ''}`}
                                name="email"
                                value={email}
                                placeholder="Enter your email"
                                onChange={onChange}
                            />
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>

                        <div className="form-field">
                            <label>Password</label>

                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`modern-input ${errors.password ? 'input-error' : ''}`}
                                    name="password"
                                    value={password}
                                    placeholder="Enter password"
                                    onChange={onChange}
                                />

                                <span
                                    className="password-toggle"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                    />
                                </span>
                            </div>

                            {errors.password && (
                                <span className="field-error">{errors.password}</span>
                            )}
                        </div>


                        <div className="form-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-link">Forgot Password?</a>
                        </div>

                        <button type="submit" className="auth-submit-btn">
                            Sign In
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
