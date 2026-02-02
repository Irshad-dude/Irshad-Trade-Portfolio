/**
 * API Service - Communicates with Express backend
 */

const API_BASE = import.meta.env.PROD ? '' : '';

export const api = {
    /**
     * Fetch all data (trades + profile) from backend
     */
    async getData() {
        const response = await fetch(`${API_BASE}/api/jsonbin/data`);
        if (!response.ok) {
            throw new Error('Failed to fetch data from backend');
        }
        return response.json();
    },

    /**
     * Save data to backend (trades + profile)
     */
    async saveData(data) {
        const response = await fetch(`${API_BASE}/api/jsonbin/data`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Failed to save data to backend');
        }
        return response.json();
    },

    /**
     * Store image URL (legacy endpoint)
     */
    async storeImage(imageUrl, tradeId = null) {
        const response = await fetch(`${API_BASE}/store/image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl, tradeId })
        });
        if (!response.ok) {
            throw new Error('Failed to store image');
        }
        return response.json();
    }
};

export default api;
