import { useState, useRef } from 'react';
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

function AdminDashboard({ profile, onAddTrade, onUpdateProfile }) {
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

    // Image previews
    const [previewBefore, setPreviewBefore] = useState(null);
    const [previewAfter, setPreviewAfter] = useState(null);

    // File refs
    const fileBeforeRef = useRef(null);
    const fileAfterRef = useRef(null);
    const profileFileRef = useRef(null);

    const handleInputChange = (e) => {
        const { id, value, name } = e.target;
        if (name === 'confidence') {
            setFormData({ ...formData, confidence: value });
        } else {
            setFormData({ ...formData, [id.replace('trade', '').charAt(0).toLowerCase() + id.replace('trade', '').slice(1)]: value });
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

    const handleDropZoneClick = (type) => {
        if (type === 'before') {
            fileBeforeRef.current?.click();
        } else {
            fileAfterRef.current?.click();
        }
    };

    const handleTradeSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let imageBeforeUrl = null;
            let imageAfterUrl = null;

            // Upload images to Cloudinary
            if (fileBeforeRef.current?.files[0]) {
                try {
                    imageBeforeUrl = await cloudinaryService.uploadImage(fileBeforeRef.current.files[0]);
                } catch (err) {
                    console.warn('Cloudinary upload failed:', err);
                    alert('Image upload failed. Trade will be logged without image.');
                }
            }

            if (fileAfterRef.current?.files[0]) {
                try {
                    imageAfterUrl = await cloudinaryService.uploadImage(fileAfterRef.current.files[0]);
                } catch (err) {
                    console.warn('After image upload failed:', err);
                }
            }

            // Create trade object
            const newTrade = {
                id: Date.now().toString(),
                instrument: formData.instrument,
                timeframe: formData.timeframe,
                category: formData.category,
                direction: formData.direction,
                rr: formData.rr,
                outcome: formData.outcome,
                notes: formData.notes,
                confidence: formData.confidence,
                date: new Date().toISOString().split('T')[0],
                imageBefore: imageBeforeUrl,
                imageAfter: imageAfterUrl
            };

            await onAddTrade(newTrade);

            // Reset form
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
            console.error('Error logging trade:', err);
            alert('Error logging trade: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleProfileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const url = await cloudinaryService.uploadImage(file);
            await onUpdateProfile({ ...profile, photo: url });
            alert('Profile Photo Updated!');
        } catch (err) {
            console.error('Profile upload failed:', err);
            alert('Profile Upload Failed: ' + err.message);
        }
    };

    const handleRemoveProfile = async () => {
        if (window.confirm('Remove profile photo?')) {
            await onUpdateProfile({ ...profile, photo: null });
            alert('Profile photo removed');
        }
    };

    return (
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
                        {/* Left Col: Images */}
                        <div className="upload-images-col">
                            <label className="text-gold mb-2 block">
                                1. Before Entry <span className="text-gray text-small">(Required)</span>
                            </label>
                            <div
                                className="upload-zone small-zone"
                                onClick={() => handleDropZoneClick('before')}
                                style={{ cursor: 'pointer' }}
                            >
                                {previewBefore ? (
                                    <div className="preview-mini" style={{ display: 'block' }}>
                                        <img src={previewBefore} alt="Before preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                onClick={() => handleDropZoneClick('after')}
                                style={{ cursor: 'pointer' }}
                            >
                                {previewAfter ? (
                                    <div className="preview-mini" style={{ display: 'block' }}>
                                        <img src={previewAfter} alt="After preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

                        {/* Right Col: Metadata */}
                        <div className="upload-meta-col">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Instrument</label>
                                    <select id="tradeInstrument" value={formData.instrument} onChange={handleInputChange}>
                                        {INSTRUMENTS.map(i => (
                                            <option key={i.value} value={i.value}>{i.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Timeframe</label>
                                    <select id="tradeTimeframe" value={formData.timeframe} onChange={handleInputChange}>
                                        {TIMEFRAMES.map(tf => (
                                            <option key={tf} value={tf}>{tf}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Model / Category</label>
                                    <select id="tradeCategory" value={formData.category} onChange={handleInputChange}>
                                        {CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
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
                                        {OUTCOMES.map(o => (
                                            <option key={o} value={o}>{o}</option>
                                        ))}
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
                                {isUploading ? (
                                    <><i className="fas fa-spinner fa-spin"></i> Uploading...</>
                                ) : (
                                    'Log Trade Entry'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Tab 2: Profile Management */}
            <div className={`dashboard-tab-content ${activeTab === 'profile' ? 'active' : ''}`}>
                <div className="profile-manager-grid">
                    <div className="current-profile-preview">
                        <h4>Current Profile</h4>
                        <div className="profile-preview-circle">
                            {profile?.photo ? (
                                <img src={profile.photo} alt="Current Profile" className="profile-img-display" />
                            ) : (
                                <div className="profile-placeholder">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                            )}
                        </div>
                        <button
                            className="btn btn-sm btn-outline btn-danger-hover"
                            onClick={handleRemoveProfile}
                        >
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
    );
}

export default AdminDashboard;
