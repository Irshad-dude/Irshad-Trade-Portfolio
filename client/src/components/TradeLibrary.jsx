import { useState, useMemo } from 'react';
import TradeCard from './TradeCard';
import AdminDashboard from './AdminDashboard';
import LoginModal from './LoginModal';

const CATEGORIES = [
    'Order Blocks', 'FVG', 'SMC Confirmations', 'BOS',
    'Liquidity Grabs', 'Supply & Demand'
];

function TradeLibrary({
    trades,
    profile,
    isAdmin,
    onLogin,
    onLogout,
    onAddTrade,
    onDeleteTrade,
    onUpdateProfile,
    onViewDetails,
    verifyDeletePassword
}) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [outcomeFilter, setOutcomeFilter] = useState('all');
    const [instrumentFilter, setInstrumentFilter] = useState('all');
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Filter trades
    const filteredTrades = useMemo(() => {
        return trades.filter(trade => {
            const matchOutcome = outcomeFilter === 'all' || trade.outcome === outcomeFilter;
            const matchInstrument = instrumentFilter === 'all' || trade.instrument === instrumentFilter;
            const matchCategory = activeCategory === 'all' || trade.category === activeCategory;
            return matchOutcome && matchInstrument && matchCategory;
        });
    }, [trades, outcomeFilter, instrumentFilter, activeCategory]);

    const handleDelete = async (tradeId) => {
        const password = prompt('Enter password to delete this trade:');
        if (password === null) return;

        if (verifyDeletePassword(password)) {
            await onDeleteTrade(tradeId);
            alert('Trade deleted successfully!');
        } else {
            alert('Incorrect password. Trade not deleted.');
        }
    };

    return (
        <section id="analysis" className="section analysis-section">
            <div className="container">
                <div className="section-header">
                    <h2>Market Analysis <span className="text-gold">Library</span></h2>
                    <p>Comprehensive Trade Journal & Educational Database</p>
                </div>

                {/* Admin Controls */}
                <div className="admin-bar">
                    {!isAdmin ? (
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={() => setShowLoginModal(true)}
                        >
                            <i className="fa-solid fa-lock"></i> Admin Login
                        </button>
                    ) : (
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={onLogout}
                        >
                            <i className="fa-solid fa-right-from-bracket"></i> Logout
                        </button>
                    )}
                </div>

                {/* Admin Dashboard (visible when logged in) */}
                {isAdmin && (
                    <AdminDashboard
                        profile={profile}
                        onAddTrade={onAddTrade}
                        onUpdateProfile={onUpdateProfile}
                    />
                )}

                {/* Library Layout */}
                <div className="library-container glass">
                    {/* Sidebar */}
                    <aside className="library-sidebar">
                        <div className="sidebar-header">
                            <h3><i className="fa-solid fa-folder-tree text-gold"></i> Library</h3>
                        </div>
                        <ul className="folder-tree">
                            <li
                                className={`sidebar-menu-btn ${activeCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveCategory('all')}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="fa-solid fa-folder-open"></i> All Trades
                            </li>
                            <li className="category-header" style={{ marginTop: '20px', paddingLeft: '5px' }}>
                                Categories
                            </li>
                            {CATEGORIES.map(cat => (
                                <li
                                    key={cat}
                                    className={`folder-item ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-regular fa-folder"></i> {cat}
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Main Content */}
                    <main className="library-content">
                        {/* Filters Toolbar */}
                        <div className="library-toolbar">
                            <div className="active-path">
                                {activeCategory === 'all' ? 'All Trades' : activeCategory}
                            </div>
                            <div className="library-filters">
                                <select
                                    className="filter-select"
                                    value={outcomeFilter}
                                    onChange={(e) => setOutcomeFilter(e.target.value)}
                                >
                                    <option value="all">All Outcomes</option>
                                    <option value="Win">Wins</option>
                                    <option value="Loss">Losses</option>
                                </select>
                                <select
                                    className="filter-select"
                                    value={instrumentFilter}
                                    onChange={(e) => setInstrumentFilter(e.target.value)}
                                >
                                    <option value="all">All Pairs</option>
                                    <option value="XAUUSD">Gold</option>
                                    <option value="BTCUSD">Bitcoin</option>
                                </select>
                            </div>
                        </div>

                        {/* Trade Grid */}
                        <div className="analysis-grid">
                            {filteredTrades.length === 0 ? (
                                <p className="text-gray" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                                    No trades found.
                                </p>
                            ) : (
                                filteredTrades.map(trade => (
                                    <TradeCard
                                        key={trade.id}
                                        trade={trade}
                                        isAdmin={isAdmin}
                                        onViewDetails={onViewDetails}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={onLogin}
            />
        </section>
    );
}

export default TradeLibrary;
