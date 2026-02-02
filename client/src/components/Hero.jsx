function Hero() {
    return (
        <section id="home" className="hero">
            <div className="hero-bg"></div>
            <div className="container">
                <div className="hero-content">
                    <span className="subtitle">Professional Forex Trader</span>
                    <h1>
                        Mastering the Art of <br />
                        <span className="text-gold">Smart Money Concepts</span>
                    </h1>
                    <p>
                        A disciplined approach to the markets, focusing on liquidity, structure, and high-probability setups.
                    </p>
                    <div className="hero-btns">
                        <a href="#analysis" className="btn btn-primary">Market Analysis</a>
                        <a href="#contact" className="btn btn-outline">Contact Me</a>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-num">2+</span>
                            <span className="stat-label">Years Experience</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-num">1.5k+</span>
                            <span className="stat-label">Trades Taken</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-num">78%</span>
                            <span className="stat-label">Win Rates</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
