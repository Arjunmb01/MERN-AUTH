function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
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
            <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
                <h2>{title}</h2>
                <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>{message}</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn"
                        onClick={onConfirm}
                        style={{ flex: 1, backgroundColor: '#ef4444', color: 'white' }}
                    >
                        Delete
                    </button>
                    <button
                        className="btn"
                        onClick={onClose}
                        style={{ flex: 1, backgroundColor: '#6b7280', color: 'white' }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
