import { useEffect, useRef } from 'react';
// Use auto import to automatically register all Chart.js components
import { Chart } from 'chart.js/auto';

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

function RiskManagement() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            // Destroy existing chart if any
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Psychology', 'Risk Management', 'Technical Analysis'],
                    datasets: [{
                        data: [40, 40, 20],
                        backgroundColor: [
                            'rgba(212, 175, 55, 0.8)',
                            'rgba(52, 152, 219, 0.8)',
                            'rgba(46, 204, 113, 0.8)'
                        ],
                        borderColor: [
                            'rgba(212, 175, 55, 1)',
                            'rgba(52, 152, 219, 1)',
                            'rgba(46, 204, 113, 1)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#fff',
                                font: { size: 14 }
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

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

                    {/* Success Formula Chart Card */}
                    <div className="strategy-card glass strategy-card-wide">
                        <div className="card-header">
                            <span className="step-number">06</span>
                            <i className="fa-solid fa-chart-pie card-icon"></i>
                        </div>
                        <h3>The Success Formula</h3>
                        <p>Trading success is not just about strategy; it's a balance of psychology, risk, and analysis.</p>
                        <div className="chart-container" style={{ height: '300px', marginTop: '20px' }}>
                            <canvas ref={chartRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RiskManagement;
