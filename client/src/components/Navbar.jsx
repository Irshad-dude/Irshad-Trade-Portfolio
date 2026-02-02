import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ profilePhoto }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <Link to="/" className="logo">
                    IRSHAD<span className="gold-dot">.</span>
                </Link>

                <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <a href="#home" onClick={(e) => handleNavClick(e, '#home')}>Home</a>
                    <a href="#profile" onClick={(e) => handleNavClick(e, '#profile')}>Profile</a>
                    <a href="#strategy" onClick={(e) => handleNavClick(e, '#strategy')}>Strategy</a>
                    <a href="#analysis" onClick={(e) => handleNavClick(e, '#analysis')}>Analysis</a>
                    <a href="#risk" onClick={(e) => handleNavClick(e, '#risk')}>Risk</a>
                    <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>

                    {profilePhoto && (
                        <div className="nav-profile-icon">
                            <img src={profilePhoto} alt="Profile" />
                        </div>
                    )}
                </div>

                <div
                    className={`hamburger ${isMobileMenuOpen ? 'toggle' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
