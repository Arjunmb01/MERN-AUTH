import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  updateUserProfile,
  uploadProfileImage,
  resetUser
} from '../features/users/userSlice';
import { setCredentials } from '../features/auth/authSlice';

function Profile() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  console.log("hjhgjh", user)
  const { isLoading, isError, message } = useSelector((state) => state.user);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);

  const validateName = (value) => {
    if (!value.trim()) {
      return 'Name is required';
    }
    if (!/^[a-zA-Z ]{3,}$/.test(value)) {
      return 'Name must be at least 3 characters and contain only letters';
    }
    return '';
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please provide a valid email address';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return ''; // optional
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (!/\d/.test(value)) {
      return 'Password must contain at least one number';
    }
    return '';
  };



  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetUser());
    }
  }, [isError, message, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email)
    const nameError = validateName(name)
    const passwordError = validatePassword(password)

    if (nameError || emailError || passwordError) {
      toast.error(nameError || emailError || passwordError)
      return
    }

    try {

      if (file) {
        const formData = new FormData();
        formData.append('image', file);

        const uploadResult = await dispatch(
          uploadProfileImage(formData)
        ).unwrap();


        dispatch(
          setCredentials({
            ...user,
            profileImage: uploadResult.imageUrl
          })
        );
      }


      await dispatch(
        updateUserProfile({ name, email, password })
      ).unwrap();


      toast.success('Profile updated successfully');

      dispatch(resetUser());
    } catch (err) {
      toast.error(err || 'Something went wrong');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <div className="card">
        <h1>User Profile</h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '2rem 0'
          }}
        >
          <img
            src={user?.profileImage || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="profile-img"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: '1rem' }}
          />
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

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
