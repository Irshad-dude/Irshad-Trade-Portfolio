import { useState } from 'react';

function LoginModal({ isOpen, onClose, onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = onLogin(password);
        if (success) {
            setPassword('');
            setError('');
            onClose();
            alert('Admin Logged In');
        } else {
            setError('Incorrect Password');
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('modal')) {
            onClose();
        }
    };

    return (
        <div
            className="modal"
            style={{ display: 'block' }}
            onClick={handleBackdropClick}
        >
            <div className="modal-content glass">
                <span className="close-modal" onClick={onClose}>&times;</span>
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter admin password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p style={{ color: '#ff4d4d', marginBottom: '15px' }}>{error}</p>}
                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;
