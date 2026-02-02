function TradeCard({ trade, onViewDetails, onDelete, isAdmin }) {
    // Generate stars HTML
    const stars = parseInt(trade.confidence || 3);

    // Badge class based on outcome
    const getBadgeClass = (outcome) => {
        switch (outcome) {
            case 'Win': return 'badge-win';
            case 'Loss': return 'badge-loss';
            case 'BE': return 'badge-be';
            default: return 'badge-pending';
        }
    };

    return (
        <div className="trade-card-new glass">
            <div className="card-img-top">
                {trade.imageBefore ? (
                    <img src={trade.imageBefore} alt={trade.instrument} />
                ) : (
                    <div className="img-placeholder">
                        <i className="fa-solid fa-chart-line"></i>
                    </div>
                )}
                <span className={`badge-outcome ${getBadgeClass(trade.outcome)}`}>{trade.outcome}</span>
                <span className="badge-instrument">{trade.instrument}</span>
                <span className="card-date">{trade.date}</span>
            </div>

            <div className="card-body">
                <div className="card-title">
                    <span>
                        {trade.direction} {trade.instrument}{' '}
                        <span className="text-small text-gray">({trade.rr})</span>
                    </span>
                </div>

                <div className="card-meta">
                    <span><i className="fa-regular fa-clock"></i> {trade.timeframe}</span>
                    <div className="card-stars">
                        {[...Array(5)].map((_, i) => (
                            <i
                                key={i}
                                className="fa-solid fa-star"
                                style={{
                                    color: i < stars ? 'var(--primary-gold)' : undefined,
                                    opacity: i < stars ? 1 : 0.3
                                }}
                            ></i>
                        ))}
                    </div>
                </div>

                <div className="card-actions">
                    <button
                        className="btn-details"
                        onClick={() => onViewDetails(trade)}
                    >
                        <i className="fa-solid fa-eye"></i> Details
                    </button>
                    {isAdmin && (
                        <button
                            className="btn-delete"
                            title="Delete Trade"
                            onClick={() => onDelete(trade.id)}
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TradeCard;
