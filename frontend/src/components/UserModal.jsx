import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

function UserModal({ isOpen, onClose, user, onSubmit, isEdit }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user && isEdit) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                role: user.role || 'user'
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'user'
            });
        }
        setErrors({});
    }, [user, isEdit, isOpen]);

    const validateName = (value) => {
        const trimmedValue = value.trim();
        if (!trimmedValue) return 'Name is required';
        if (trimmedValue.length < 2) return 'Name must be at least 2 characters';
        if (!/^[A-Za-z]/.test(trimmedValue)) return 'Name must start with a letter';
        if (!/^[A-Za-z][A-Za-z\s]*$/.test(trimmedValue)) return 'Name can only contain letters and spaces';
        return '';
    };

    const validateEmail = (value) => {
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please provide a valid email address';
        return '';
    };

    const validatePassword = (value) => {
        if (!isEdit && !value) return 'Password is required';
        if (value && value.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        let error = '';
        if (name === 'name') error = validateName(value);
        else if (name === 'email') error = validateEmail(value);
        else if (name === 'password') error = validatePassword(value);

        setErrors((prev) => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        setErrors({
            name: nameError,
            email: emailError,
            password: passwordError
        });

        if (nameError || emailError || passwordError) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        const submitData = {
            name: formData.name.trim(),
            email: formData.email,
            role: formData.role
        };

        if (formData.password) {
            submitData.password = formData.password;
        }

        onSubmit(submitData);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '500px', maxWidth: '90%', maxHeight: '90vh', overflow: 'auto' }}>
                <h2>{isEdit ? 'Edit User' : 'Add New User'}</h2>
                <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'error' : ''}`}
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            placeholder="Enter name"
                            required
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'error' : ''}`}
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            placeholder="Enter email"
                            required
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label>Password {isEdit && '(Leave blank to keep current)'}</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'error' : ''}`}
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            placeholder={isEdit ? 'Enter new password (optional)' : 'Enter password'}
                            required={!isEdit}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <select
                            className="form-control"
                            name="role"
                            value={formData.role}
                            onChange={onChange}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            {isEdit ? 'Update User' : 'Create User'}
                        </button>
                        <button type="button" className="btn" onClick={onClose} style={{ flex: 1, backgroundColor: '#6b7280', color: 'white' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserModal;
