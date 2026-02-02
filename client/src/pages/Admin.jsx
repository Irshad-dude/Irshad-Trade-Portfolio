import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useTrades from '../hooks/useTrades';
import useAuth from '../hooks/useAuth';
import cloudinaryService from '../services/cloudinary';

const INSTRUMENTS = [
    { value: 'XAUUSD', label: 'Gold (XAUUSD)' },
    { value: 'BTCUSD', label: 'Bitcoin (BTCUSD)' },
    { value: 'EURUSD', label: 'EURUSD' },
    { value: 'GBPUSD', label: 'GBPUSD' },
    { value: 'US30', label: 'US30' },
    { value: 'NAS100', label: 'NAS100' }
];

const TIMEFRAMES = ['M1', 'M5', 'M15', 'H1', 'H4', 'D1'];
const CATEGORIES = [
    'Order Blocks', 'FVG', 'SMC Confirmations', 'BOS',
    'Liquidity Grabs', 'Supply & Demand', 'Institutional Candles', 'Rejection'
];
const OUTCOMES = ['Win', 'Loss', 'BE', 'Pending'];

function Admin() {
    const { profile, addTrade, updateProfile } = useTrades();
    const { isAdmin, login, logout } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('analysis');
    const [isUploading, setIsUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        instrument: 'XAUUSD',
        timeframe: 'M15',
        category: 'Order Blocks',
        direction: 'Buy',
        rr: '',
        outcome: 'Win',
        confidence: '3',
        notes: ''
    });

    const [previewBefore, setPreviewBefore] = useState(null);
    const [previewAfter, setPreviewAfter] = useState(null);

    const fileBeforeRef = useRef(null);
    const fileAfterRef = useRef(null);
    const profileFileRef = useRef(null);

    const handleLogin = (e) => {
        e.preventDefault();
        const success = login(password);
        if (success) {
            setEmail('');
            setPassword('');
        } else {
            alert('Invalid Credentials');
        }
    };

    const handleInputChange = (e) => {
        const { id, value, name } = e.target;
        if (name === 'confidence') {
            setFormData({ ...formData, confidence: value });
        } else {
            const key = id.replace('trade', '');
            const formKey = key.charAt(0).toLowerCase() + key.slice(1);
            setFormData({ ...formData, [formKey]: value });
        }
    };

    const handleFileSelect = (type, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (type === 'before') {
                    setPreviewBefore(ev.target.result);
                } else {
                    setPreviewAfter(ev.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTradeSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let imageBeforeUrl = null;
            let imageAfterUrl = null;

            if (fileBeforeRef.current?.files[0]) {
                try {
                    imageBeforeUrl = await cloudinaryService.uploadImage(fileBeforeRef.current.files[0]);
                } catch (err) {
                    console.warn('Upload failed:', err);
                }
            }

            if (fileAfterRef.current?.files[0]) {
                try {
                    imageAfterUrl = await cloudinaryService.uploadImage(fileAfterRef.current.files[0]);
                } catch (err) {
                    console.warn('Upload failed:', err);
                }
            }

            if (!imageBeforeUrl) {
                if (!window.confirm("No 'Before' image selected. Proceed anyway?")) {
                    setIsUploading(false);
                    return;
                }
            }

            const newTrade = {
                id: Date.now().toString(),
                ...formData,
                date: new Date().toISOString().split('T')[0],
                imageBefore: imageBeforeUrl,
                imageAfter: imageAfterUrl
            };

            await addTrade(newTrade);

            // Reset
            setFormData({
                instrument: 'XAUUSD',
                timeframe: 'M15',
                category: 'Order Blocks',
                direction: 'Buy',
                rr: '',
                outcome: 'Win',
                confidence: '3',
                notes: ''
            });
            setPreviewBefore(null);
            setPreviewAfter(null);
            if (fileBeforeRef.current) fileBeforeRef.current.value = '';
            if (fileAfterRef.current) fileAfterRef.current.value = '';

            alert('Trade Logged Successfully!');
        } catch (err) {
            console.error(err);
            alert('Error: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleProfileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const url = await cloudinaryService.uploadImage(file);
            await updateProfile({ ...profile, photo: url });
            alert('Profile Photo Updated Globally!');
        } catch (err) {
            console.error(err);
            alert('Upload Failed: ' + err.message);
        }
    };

    const handleRemoveProfile = async () => {
        if (window.confirm('Remove profile photo?')) {
            await updateProfile({ ...profile, photo: null });
            alert('Profile photo removed');
        }
    };

    return (
        <>
            {/* Admin Navigation */}
            <nav className="admin-nav" style={{
                padding: '20px',
                background: 'rgba(10, 10, 10, 0.9)',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link to="/" className="logo">
                    IRSHAD<span className="gold-dot">.</span>
                    <span className="text-small text-gray" style={{ marginLeft: '10px', fontWeight: 400 }}>
                        Admin Portal
                    </span>
                </Link>
                <div>
                    <Link to="/" className="btn btn-sm btn-outline" style={{ marginRight: '10px' }}>
                        Back to Site
                    </Link>
                    {isAdmin && (
                        <button className="btn btn-sm btn-outline btn-danger-hover" onClick={logout}>
                            Logout
                        </button>
                    )}
                </div>
            </nav>

            <div className="admin-wrapper" style={{
                flex: 1,
                padding: '40px 20px',
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
                minHeight: 'calc(100vh - 80px)'
            }}>
                {/* Login Section */}
                {!isAdmin ? (
                    <div className="login-container glass" style={{ maxWidth: '400px', margin: '100px auto', padding: '40px' }}>
                        <div className="section-header" style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '1.8rem' }}>Admin Login</h2>
                        </div>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Login to Dashboard</button>
                        </form>
                    </div>
                ) : (
                    /* Dashboard Section */
                    <div className="admin-dashboard glass" style={{ borderColor: 'var(--primary-gold)' }}>
                        <div className="dashboard-header">
                            <h3><i className="fa-solid fa-gauge-high text-gold"></i> Admin Dashboard</h3>
                            <div className="dashboard-tabs">
                                <button
                                    className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('analysis')}
                                >
                                    New Trade Entry
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    Profile Photo
                                </button>
                            </div>
                        </div>

                        {/* Tab 1: Trade Entry */}
                        <div className={`dashboard-tab-content ${activeTab === 'analysis' ? 'active' : ''}`}>
                            <form onSubmit={handleTradeSubmit}>
                                <div className="upload-grid-advanced">
                                    <div className="upload-images-col">
                                        <label className="text-gold mb-2 block">
                                            1. Before Entry <span className="text-gray text-small">(Required)</span>
                                        </label>
                                        <div
                                            className="upload-zone small-zone"
                                            onClick={() => fileBeforeRef.current?.click()}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {previewBefore ? (
                                                <div className="preview-mini" style={{ display: 'block' }}>
                                                    <img src={previewBefore} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            ) : (
                                                <>
                                                    <i className="fa-solid fa-image text-gray"></i>
                                                    <p className="text-small">Drag 'Before' Chart</p>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                ref={fileBeforeRef}
                                                accept="image/*"
                                                hidden
                                                onChange={(e) => handleFileSelect('before', e)}
                                            />
                                        </div>

                                        <label className="text-gold mb-2 block mt-2">
                                            2. After Result <span className="text-gray text-small">(Optional)</span>
                                        </label>
                                        <div
                                            className="upload-zone small-zone"
                                            onClick={() => fileAfterRef.current?.click()}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {previewAfter ? (
                                                <div className="preview-mini" style={{ display: 'block' }}>
                                                    <img src={previewAfter} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            ) : (
                                                <>
                                                    <i className="fa-solid fa-flag-checkered text-gray"></i>
                                                    <p className="text-small">Drag 'After' Chart</p>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                ref={fileAfterRef}
                                                accept="image/*"
                                                hidden
                                                onChange={(e) => handleFileSelect('after', e)}
                                            />
                                        </div>
                                    </div>

                                    <div className="upload-meta-col">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Instrument</label>
                                                <select id="tradeInstrument" value={formData.instrument} onChange={handleInputChange}>
                                                    {INSTRUMENTS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Timeframe</label>
                                                <select id="tradeTimeframe" value={formData.timeframe} onChange={handleInputChange}>
                                                    {TIMEFRAMES.map(tf => <option key={tf} value={tf}>{tf}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Model / Category</label>
                                                <select id="tradeCategory" value={formData.category} onChange={handleInputChange}>
                                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Direction</label>
                                                <select id="tradeDirection" value={formData.direction} onChange={handleInputChange}>
                                                    <option value="Buy">Long (Buy)</option>
                                                    <option value="Sell">Short (Sell)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Risk:Reward</label>
                                                <input
                                                    type="text"
                                                    id="tradeRr"
                                                    placeholder="e.g. 1:3"
                                                    value={formData.rr}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Outcome</label>
                                                <select id="tradeOutcome" value={formData.outcome} onChange={handleInputChange}>
                                                    {OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Confidence</label>
                                            <div className="star-rating">
                                                {[5, 4, 3, 2, 1].map(val => (
                                                    <span key={val}>
                                                        <input
                                                            type="radio"
                                                            name="confidence"
                                                            value={val}
                                                            id={`c${val}`}
                                                            checked={formData.confidence === String(val)}
                                                            onChange={handleInputChange}
                                                        />
                                                        <label htmlFor={`c${val}`}>★</label>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Notes / Confluence</label>
                                            <textarea
                                                id="tradeNotes"
                                                rows="3"
                                                placeholder="Liquidity sweep confirmed, entered on retest..."
                                                required
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block"
                                            disabled={isUploading}
                                        >
                                            {isUploading ? <><i className="fas fa-spinner fa-spin"></i> Uploading...</> : 'Log Trade Entry'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Tab 2: Profile */}
                        <div className={`dashboard-tab-content ${activeTab === 'profile' ? 'active' : ''}`}>
                            <div className="profile-manager-grid">
                                <div className="current-profile-preview">
                                    <h4>Current Profile</h4>
                                    <div className="profile-preview-circle">
                                        {profile?.photo ? (
                                            <img src={profile.photo} alt="Profile" className="profile-img-display" />
                                        ) : (
                                            <div className="profile-placeholder"><i className="fa-solid fa-user"></i></div>
                                        )}
                                    </div>
                                    <button className="btn btn-sm btn-outline btn-danger-hover" onClick={handleRemoveProfile}>
                                        Remove Photo
                                    </button>
                                </div>
                                <div className="new-profile-upload">
                                    <h4>Upload New Photo</h4>
                                    <div className="upload-zone small-zone">
                                        <i className="fa-solid fa-camera fa-2x text-gray"></i>
                                        <p>Drag & Drop or Browse</p>
                                        <label htmlFor="profileInput" className="btn btn-sm btn-primary">Select Image</label>
                                        <input
                                            type="file"
                                            id="profileInput"
                                            ref={profileFileRef}
                                            accept="image/jpeg, image/png, image/webp"
                                            hidden
                                            onChange={handleProfileUpload}
                                        />
                                    </div>
                                    <p className="text-small text-gray mt-2">JPG, PNG, WEBP (Max 10MB)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Admin;
