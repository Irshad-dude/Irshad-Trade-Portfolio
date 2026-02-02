import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Profile from '../components/Profile';
import Strategy from '../components/Strategy';
import TradeLibrary from '../components/TradeLibrary';
import RiskManagement from '../components/RiskManagement';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import TradeModal from '../components/TradeModal';
import useTrades from '../hooks/useTrades';
import useAuth from '../hooks/useAuth';

function Home() {
    const {
        trades,
        profile,
        loading,
        addTrade,
        deleteTrade,
        updateProfile
    } = useTrades();

    const { isAdmin, login, logout, verifyDeletePassword } = useAuth();

    const [selectedTrade, setSelectedTrade] = useState(null);

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-dark)',
                color: 'var(--text-white)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary-gold)' }}></i>
                    <p style={{ marginTop: '15px' }}>Loading Portfolio...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar profilePhoto={profile?.photo} />
            <Hero />
            <Profile photo={profile?.photo} />
            <Strategy />

            <TradeLibrary
                trades={trades}
                profile={profile}
                isAdmin={isAdmin}
                onLogin={login}
                onLogout={logout}
                onAddTrade={addTrade}
                onDeleteTrade={deleteTrade}
                onUpdateProfile={updateProfile}
                onViewDetails={setSelectedTrade}
                verifyDeletePassword={verifyDeletePassword}
            />

            <RiskManagement />
            <Contact />
            <Footer />

            {/* Trade Detail Modal */}
            {selectedTrade && (
                <TradeModal
                    trade={selectedTrade}
                    onClose={() => setSelectedTrade(null)}
                />
            )}
        </>
    );
}

export default Home;
