import { Outlet } from 'react-router-dom';

function AdminLayout() {
    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div className="card">
                <h1 style={{ marginBottom: '1.5rem' }}>Admin Panel - User Management</h1>
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;
