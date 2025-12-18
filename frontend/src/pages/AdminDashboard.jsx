import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getUsers, deleteUser, createUser, updateUser, resetAdmin } from '../features/admin/adminSlice';
import UserModal from '../components/UserModal';
import ConfirmModal from '../components/ConfirmModal';

function AdminDashboard() {
    const dispatch = useDispatch();
    const { users, page, pages, isLoading, isError, isSuccess, message } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        dispatch(getUsers({ keyword: searchTerm, pageNumber: currentPage }));
    }, [dispatch, searchTerm, currentPage]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess && message) {
            toast.success(message);
            setIsModalOpen(false);
            setSelectedUser(null);
        }
        dispatch(resetAdmin());
    }, [isError, isSuccess, message, dispatch]);

    const handleDelete = (user) => {
        setUserToDelete(user);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            dispatch(deleteUser(userToDelete._id));
            setIsConfirmOpen(false);
            setUserToDelete(null);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setIsEdit(false);
        setIsModalOpen(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsEdit(true);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (userData) => {
        if (isEdit && selectedUser) {
            dispatch(updateUser({ id: selectedUser._id, userData }));
        } else {
            dispatch(createUser(userData));
        }
    };

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
    };

    const renderPagination = () => {
        if (!pages || pages <= 1) return null;

        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1.5rem',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn"
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: currentPage === 1 ? '#e5e7eb' : '#667eea',
                        color: currentPage === 1 ? '#9ca3af' : 'white',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        border: 'none',
                        borderRadius: '6px'
                    }}
                >
                    Previous
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="btn"
                            style={{
                                padding: '0.5rem 0.75rem',
                                backgroundColor: 'white',
                                color: '#374151',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                minWidth: '40px'
                            }}
                        >
                            1
                        </button>
                        {startPage > 2 && <span style={{ color: '#6b7280' }}>...</span>}
                    </>
                )}

                {pageNumbers.map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className="btn"
                        style={{
                            padding: '0.5rem 0.75rem',
                            backgroundColor: currentPage === pageNum ? '#667eea' : 'white',
                            color: currentPage === pageNum ? 'white' : '#374151',
                            border: currentPage === pageNum ? 'none' : '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontWeight: currentPage === pageNum ? '600' : '400',
                            minWidth: '40px'
                        }}
                    >
                        {pageNum}
                    </button>
                ))}

                {endPage < pages && (
                    <>
                        {endPage < pages - 1 && <span style={{ color: '#6b7280' }}>...</span>}
                        <button
                            onClick={() => handlePageChange(pages)}
                            className="btn"
                            style={{
                                padding: '0.5rem 0.75rem',
                                backgroundColor: 'white',
                                color: '#374151',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                minWidth: '40px'
                            }}
                        >
                            {pages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pages}
                    className="btn"
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: currentPage === pages ? '#e5e7eb' : '#667eea',
                        color: currentPage === pages ? '#9ca3af' : 'white',
                        cursor: currentPage === pages ? 'not-allowed' : 'pointer',
                        border: 'none',
                        borderRadius: '6px'
                    }}
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>User Management</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="form-control"
                        style={{ width: '300px' }}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleAddUser}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        + Add User
                    </button>
                </div>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : isError && !message ? (
                <p style={{ color: 'red' }}>Error loading users</p>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>ROLE</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>
                                        <a href={`mailto:${user.email}`}>{user.email}</a>
                                    </td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button
                                            className="btn"
                                            style={{ backgroundColor: '#3b82f6', color: 'white', marginRight: '0.5rem' }}
                                            onClick={() => handleEditUser(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn"
                                            style={{ backgroundColor: '#ef4444', color: 'white' }}
                                            onClick={() => handleDelete(user)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {renderPagination()}
                </>
            )}

            <UserModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                onSubmit={handleModalSubmit}
                isEdit={isEdit}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => {
                    setIsConfirmOpen(false);
                    setUserToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
            />
        </div>
    );
}

export default AdminDashboard;

