function Profile({ photo }) {
    return (
        <section id="profile" className="section profile-section">
            <div className="container">
                <div className="section-header">
                    <h2>Trader <span className="text-gold">Profile</span></h2>
                    <p>Get to know the person behind the charts</p>
                </div>

                <div className="profile-grid glass">
                    <div className="profile-card">
                        <div className="profile-img-container">
                            {photo ? (
                                <img src={photo} alt="Profile" className="profile-img-display" />
                            ) : (
                                <div className="profile-placeholder">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                            )}
                        </div>
                        <h3>Irshad Sheikh</h3>
                        <p className="role">Professional Forex & US Market Trader</p>

                        <div className="profile-info">
                            <div className="info-row">
                                <span><i className="fa-solid fa-chart-line"></i> Experience</span>
                                <span>2 Years</span>
                            </div>
                            <div className="info-row">
                                <span><i className="fa-solid fa-crosshairs"></i> Focus</span>
                                <span>XAUUSD, BTCUSD & US MARKET</span>
                            </div>
                            <div className="info-row">
                                <span><i className="fa-solid fa-location-dot"></i> Location</span>
                                <span>India</span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-details">
                        <h3>My Journey</h3>
                        <p>
                            With over 2 years of dedicated experience in the financial markets, I have honed a trading
                            methodology rooted in Smart Money Concepts (SMC). My journey began with a curiosity for market
                            mechanics, which evolved into a disciplined profession.
                        </p>
                        <p>
                            I specialize in identifying institutional order flow, liquidity sweeps, and market structure
                            shifts to execute high-probability trades. My approach is purely technical, stripping away the
                            noise to focus on what price action is truly communicating.
                        </p>
                        <div className="skills-container">
                            <span className="skill-tag">Smart Money Concepts</span>
                            <span className="skill-tag">Price Action</span>
                            <span className="skill-tag">Risk Management</span>
                            <span className="skill-tag">Trading Psychology</span>
                            <span className="skill-tag">Order Block</span>
                            <span className="skill-tag">Technical Analysis</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Profile;
