import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for managing trade data
 */
export function useTrades() {
    const [trades, setTrades] = useState([]);
    const [profile, setProfile] = useState({ name: 'Irshad Sheikh', photo: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await api.getData();
            setTrades(data.trades || []);
            setProfile(data.profile || { name: 'Irshad Sheikh', photo: null });
            console.log(`✅ Loaded ${data.trades?.length || 0} trades from backend`);
        } catch (err) {
            console.error('Error loading data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const saveData = useCallback(async (updatedTrades, updatedProfile) => {
        try {
            const payload = {
                trades: updatedTrades ?? trades,
                profile: updatedProfile ?? profile
            };
            await api.saveData(payload);
            console.log('✅ Data saved to backend');
        } catch (err) {
            console.error('Error saving data:', err);
            throw err;
        }
    }, [trades, profile]);

    const addTrade = useCallback(async (trade) => {
        const newTrades = [trade, ...trades];
        setTrades(newTrades);
        await saveData(newTrades, profile);
    }, [trades, profile, saveData]);

    const deleteTrade = useCallback(async (tradeId) => {
        const newTrades = trades.filter(t => t.id !== tradeId);
        setTrades(newTrades);
        await saveData(newTrades, profile);
    }, [trades, profile, saveData]);

    const updateProfile = useCallback(async (newProfile) => {
        setProfile(newProfile);
        await saveData(trades, newProfile);
    }, [trades, saveData]);

    const refreshData = useCallback(() => {
        loadData();
    }, []);

    return {
        trades,
        profile,
        loading,
        error,
        addTrade,
        deleteTrade,
        updateProfile,
        refreshData
    };
}

export default useTrades;
