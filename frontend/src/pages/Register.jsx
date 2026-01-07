import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import '../styles/AuthPages.css';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

    const { name, email, password, confirmPassword } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const validateName = (value) => {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            return 'Name is required';
        }
        if (trimmedValue.length < 2) {
            return 'Name must be at least 2 characters';
        }
        if (!/^[A-Za-z]/.test(trimmedValue)) {
            return 'Name must start with a letter';
        }
        if (!/^[A-Za-z][A-Za-z\s]*$/.test(trimmedValue)) {
            return 'Name can only contain letters and spaces';
        }
        return '';
    };

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
        if (value.length < 6) {
            return 'Password must be at least 6 characters';
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
        if (name === 'name') {
            error = validateName(value);
        } else if (name === 'email') {
            error = validateEmail(value);
        } else if (name === 'password') {
            error = validatePassword(value);
        } else if (name === 'confirmPassword') {
            error = value !== formData.password ? 'Passwords do not match' : '';
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmPasswordError = password !== confirmPassword ? 'Passwords do not match' : '';

        setErrors({
            name: nameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError
        });

        if (nameError || emailError || passwordError || confirmPasswordError) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        const userData = {
            name: name.trim(),
            email,
            password,
        };

        dispatch(register(userData));
    };

    if (isLoading) {
        return <div className="auth-loading">Loading...</div>;
    }

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="gradient-bg"></div>
                <div className="auth-left-content">
                    <p className="quote-label">START YOUR JOURNEY</p>
                    <h1 className="auth-title">
                        Create Your<br />
                        Account<br />
                        Today
                    </h1>
                    <p className="auth-subtitle">
                        Join thousands of users who trust our platform.<br />
                        Sign up now and start your journey with us.
                    </p>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-form-container">
                    <div className="brand-logo">🔐 MERN App</div>

                    <h2 className="welcome-title">Create Account</h2>
                    <p className="welcome-subtitle">Enter your details to create your account</p>

                    <form onSubmit={onSubmit} className="auth-form">
                        <div className="form-field">
                            <label>Name</label>
                            <input
                                type="text"
                                className={`modern-input ${errors.name ? 'input-error' : ''}`}
                                name="name"
                                value={name}
                                placeholder="Enter your name"
                                onChange={onChange}
                            />
                            {errors.name && <span className="field-error">{errors.name}</span>}
                        </div>

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


                        <div className="form-field">
                            <label>Confirm Password</label>

                            <div className="password-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={`modern-input ${errors.confirmPassword ? 'input-error' : ''
                                        }`}
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    placeholder="Confirm password"
                                    onChange={onChange}
                                />

                                <span
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword((prev) => !prev)
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            showConfirmPassword
                                                ? faEyeSlash
                                                : faEye
                                        }
                                    />
                                </span>
                            </div>

                            {errors.confirmPassword && (
                                <span className="field-error">
                                    {errors.confirmPassword}
                                </span>
                            )}
                        </div>


                        <button type="submit" className="auth-submit-btn">
                            Sign Up
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
