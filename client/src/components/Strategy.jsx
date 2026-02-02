const STRATEGY_STEPS = [
    {
        number: '01',
        icon: 'fa-layer-group',
        title: 'Market Structure',
        description: 'Identifying the overall trend direction using Higher Timeframe (HTF) analysis.',
        points: ['Map Swing Highs & Lows', 'Identify BOS (Break of Structure)']
    },
    {
        number: '02',
        icon: 'fa-arrow-right-arrow-left',
        title: 'Change of Character',
        description: 'Spotting early signs of trend reversal or pullback phases on Lower Timeframes (LTF).',
        points: ['Wait for ChoCH', 'Confirm Trend Shift']
    },
    {
        number: '03',
        icon: 'fa-cube',
        title: 'Order Blocks',
        description: 'Locating institutional footprints where large orders were placed.',
        points: ['Identify Valid OBs', 'Mark POI (Point of Interest)']
    },
    {
        number: '04',
        icon: 'fa-magnet',
        title: 'Fair Value Gaps',
        description: 'Identifying imbalances in price action that act as magnets for price to return to.',
        points: ['Mark FVG Zones', 'Wait for Mitigation']
    },
    {
        number: '05',
        icon: 'fa-droplet',
        title: 'Liquidity',
        description: 'Understanding where retail stops are resting to anticipate market manipulation.',
        points: ['Spot Equal Highs/Lows', 'Wait for Liquidity Sweep']
    },
    {
        number: '06',
        icon: 'fa-crosshairs',
        title: 'Entry & Confirmation',
        description: 'Executing the trade with strict rules after all criteria are met.',
        points: ['LTF Confirmation Entry', 'Set Stop Loss & TP']
    }
];

function Strategy() {
    return (
        <section id="strategy" className="section strategy-section">
            <div className="container">
                <div className="section-header">
                    <h2>Trading <span className="text-gold">Strategy</span></h2>
                    <p>My 7-Step SMC Framework</p>
                </div>

                <div className="strategy-grid">
                    {STRATEGY_STEPS.map((step) => (
                        <div key={step.number} className="strategy-card glass">
                            <div className="card-header">
                                <span className="step-number">{step.number}</span>
                                <i className={`fa-solid ${step.icon} card-icon`}></i>
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                            <ul className="strategy-list">
                                {step.points.map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Wide Trade Management Card */}
                    <div className="strategy-card glass strategy-card-wide">
                        <div className="card-header">
                            <span className="step-number">07</span>
                            <i className="fa-solid fa-list-check card-icon"></i>
                        </div>
                        <h3>Trade Management</h3>
                        <p>Managing the trade actively to secure profits and minimize risk.</p>
                        <div className="strategy-details-grid">
                            <ul className="strategy-list">
                                <li>Move SL to Breakeven</li>
                                <li>Partial Profit Taking</li>
                            </ul>
                            <ul className="strategy-list">
                                <li>Journaling the Setup</li>
                                <li>Reviewing Performance</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Strategy;
