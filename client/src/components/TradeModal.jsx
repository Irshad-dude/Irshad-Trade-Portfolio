import { useState } from 'react';

function TradeModal({ trade, onClose }) {
    const [showBefore, setShowBefore] = useState(true);

    if (!trade) return null;

    const getBadgeClass = (outcome) => {
        switch (outcome) {
            case 'Win': return 'badge-win';
            case 'Loss': return 'badge-loss';
            default: return '';
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('modal')) {
            onClose();
        }
    };

    const currentImage = showBefore ? trade.imageBefore : trade.imageAfter;

    return (
        <div
            className="modal"
            style={{ display: 'block', opacity: 1, pointerEvents: 'auto' }}
            onClick={handleBackdropClick}
        >
            <div className="modal-content modal-xl">
                <span className="close-modal-new" onClick={onClose}>&times;</span>

                <div className="trade-modal-grid">
                    {/* Left: Image Area */}
                    <div className="trade-images-col">
                        {currentImage ? (
                            <img src={currentImage} alt="Trade Setup" className="trade-img-full" />
                        ) : (
                            <div className="img-placeholder" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fa-solid fa-chart-line fa-3x"></i>
                            </div>
                        )}

                        <div className="image-toggle-pill">
                            <button
                                className={`pill-btn ${showBefore ? 'active' : ''}`}
                                onClick={() => setShowBefore(true)}
                            >
                                Before
                            </button>
                            <button
                                className={`pill-btn ${!showBefore ? 'active' : ''}`}
                                onClick={() => setShowBefore(false)}
                                disabled={!trade.imageAfter}
                                title={!trade.imageAfter ? 'No After Image' : 'View Result'}
                            >
                                After
                            </button>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="trade-details-col">
                        <div className="detail-header">
                            <h2 className="detail-title">{trade.direction} {trade.instrument} Setup</h2>
                            <div
                                className={getBadgeClass(trade.outcome)}
                                style={{ display: 'inline-block', padding: '5px 15px', borderRadius: '4px', fontWeight: 700 }}
                            >
                                {trade.outcome}
                            </div>
                        </div>

                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Instrument</span>
                                <span className="detail-value">{trade.instrument}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Direction</span>
                                <span className="detail-value">{trade.direction}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">RR Ratio</span>
                                <span className="detail-value">{trade.rr}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Timeframe</span>
                                <span className="detail-value">{trade.timeframe}</span>
                            </div>
                        </div>

                        <div className="detail-notes">
                            <span className="detail-label block mb-2">Analysis Notes</span>
                            <p className="notes-text">{trade.notes}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TradeModal;
