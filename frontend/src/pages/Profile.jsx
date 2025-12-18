import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserProfile, uploadProfileImage, resetUser } from '../features/users/userSlice';
import { setCredentials } from '../features/auth/authSlice'; // To manually update if needed

function Profile() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { isLoading, isError, message, isSuccess } = useSelector((state) => state.user);

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess) {
            toast.success('Profile Updated!');
        }
        dispatch(resetUser());
    }, [isError, message, isSuccess, dispatch]);

    const submitHandler = async (e) => {
        e.preventDefault();

        // 1. Upload Image first if exists
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            const resultAction = await dispatch(uploadProfileImage(formData));

            if (uploadProfileImage.fulfilled.match(resultAction)) {
                // Update local user state with new image url
                const newImageUrl = resultAction.payload.imageUrl;
                dispatch(setCredentials({
                    ...user,
                    profileImage: newImageUrl
                }));
            } else {
                // Stop if upload failed
                return;
            }
        }

        // 2. Update Profile Info
        dispatch(updateUserProfile({ name, email, password }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
            <div className="card">
                <h1>User Profile</h1>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0' }}>
                    <img
                        src={user?.profileImage || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        className="profile-img"
                    />
                    <input type="file" onChange={handleFileChange} style={{ marginTop: '1rem' }} />
                </div>

                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password (Leave blank to keep same)</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profile;
