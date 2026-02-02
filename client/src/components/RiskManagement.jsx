const RISK_RULES = [
    {
        number: '01',
        icon: 'fa-shield-halved',
        title: 'Daily Limits',
        description: 'Strict adherence to a maximum daily loss limit to preserve capital for the next opportunity.',
        points: ['Max Daily Loss: <strong>2%</strong>', 'Stop trading after 2 losses']
    },
    {
        number: '02',
        icon: 'fa-scale-balanced',
        title: 'Position Sizing',
        description: 'Consistent risk per trade ensures that no single trade can significantly damage the account.',
        points: ['Risk Per Trade: <strong>1%</strong>', 'Dynamic lot sizing']
    },
    {
        number: '03',
        icon: 'fa-anchor',
        title: 'Stop Loss',
        description: 'Every trade must have a hard stop loss in place at the moment of entry. No mental stops.',
        points: ['Based on market structure', 'Never widen a stop loss']
    },
    {
        number: '04',
        icon: 'fa-calendar-xmark',
        title: 'News Events',
        description: 'Avoid trading during high-impact news releases to protect against slippage and volatility.',
        points: ['Check Economic Calendar', 'Flat 10 mins before/after']
    },
    {
        number: '05',
        icon: 'fa-book',
        title: 'Journaling',
        description: 'Documenting every trade is crucial for reviewing performance and improving psychology.',
        points: ['Screenshot entries/exits', 'Note emotions & mistakes']
    }
];

// Static Success Formula data shown with CSS-only visualization
const SUCCESS_FORMULA = [
    { label: 'Psychology', value: 40, color: '#D4AF37' },
    { label: 'Risk Management', value: 40, color: '#3498DB' },
    { label: 'Technical Analysis', value: 20, color: '#2ECC71' }
];

function RiskManagement() {
    return (
        <section id="risk" className="section risk-section">
            <div className="container">
                <div className="section-header">
                    <h2>Risk <span className="text-gold">Management</span></h2>
                    <p>The key to longevity in trading</p>
                </div>

                <div className="strategy-grid">
                    {RISK_RULES.map((rule) => (
                        <div key={rule.number} className="strategy-card glass">
                            <div className="card-header">
                                <span className="step-number">{rule.number}</span>
                                <i className={`fa-solid ${rule.icon} card-icon`}></i>
                            </div>
                            <h3>{rule.title}</h3>
                            <p>{rule.description}</p>
                            <ul className="strategy-list">
                                {rule.points.map((point, idx) => (
                                    <li key={idx} dangerouslySetInnerHTML={{ __html: point }}></li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Success Formula Card - CSS only visualization */}
                    <div className="strategy-card glass strategy-card-wide">
                        <div className="card-header">
                            <span className="step-number">06</span>
                            <i className="fa-solid fa-chart-pie card-icon"></i>
                        </div>
                        <h3>The Success Formula</h3>
                        <p>Trading success is not just about strategy; it's a balance of psychology, risk, and analysis.</p>

                        {/* CSS-based visualization instead of Chart.js */}
                        <div style={{
                            marginTop: '30px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            {SUCCESS_FORMULA.map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px'
                                }}>
                                    <div style={{
                                        width: '50px',
                                        textAlign: 'right',
                                        fontSize: '14px',
                                        color: item.color,
                                        fontWeight: 'bold'
                                    }}>
                                        {item.value}%
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        height: '30px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '15px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${item.value}%`,
                                            height: '100%',
                                            background: `linear-gradient(90deg, ${item.color}dd, ${item.color}88)`,
                                            borderRadius: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            paddingLeft: '15px',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            color: '#fff'
                                        }}>
                                            {item.label}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RiskManagement;
