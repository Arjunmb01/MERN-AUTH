import { useSelector } from 'react-redux';

function AdminHome() {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div className="card">
                <h1>Admin Dashboard</h1>
                <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
                    Welcome back, <strong>{user?.name}</strong>!
                </p>

                <div style={{ marginTop: '2rem' }}>
                    <h2>Quick Actions</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <h3>User Management</h3>
                            <p>View, edit, and manage all users</p>
                        </div>
                        <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                            <h3>System Overview</h3>
                            <p>Monitor system health and activity</p>
                        </div>
                        <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                            <h3>Reports</h3>
                            <p>Generate and view reports</p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <h3>Admin Privileges</h3>
                    <ul style={{ marginTop: '1rem', lineHeight: '2' }}>
                        <li>✓ Full access to user management</li>
                        <li>✓ View and modify user profiles</li>
                        <li>✓ Delete user accounts</li>
                        <li>✓ Manage user roles and permissions</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
