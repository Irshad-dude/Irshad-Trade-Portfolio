/**
 * JSONBin Service
 * Handles global data persistence via JSONBin.io
 * This is the single source of truth for trades and profile data
 */

const BIN_ID = '6978977c43b1c97be94e3010';
const BASE_URL = 'https://api.jsonbin.io/v3/b';

// JSONBin Master Key for authentication
const MASTER_KEY = '$2a$10$6EbpRNeA3IAJTO.mEUrVFO7VfarJwZOkkasbiAd6yhtn.wTO7aC/m';

export const JSONBinService = {
    /**
     * Fetches the latest data from JSONBin
     * @returns {Promise<Object>} { profile: {...}, trades: [...] }
     */
    fetchData: async () => {
        const url = `${BASE_URL}/${BIN_ID}/latest`;

        try {
            console.log('📥 Fetching data from JSONBin...');

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Master-Key': MASTER_KEY
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('JSONBin GET Error:', errorData);
                throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Data fetched successfully from JSONBin');

            // JSONBin wraps data in a 'record' field
            return result.record || { profile: {}, trades: [] };

        } catch (error) {
            console.error('❌ JSONBin fetch error:', error);

            // Fallback to empty state
            console.warn('Returning empty state as fallback');
            return {
                profile: { name: 'Irshad Sheikh', photo: null },
                trades: []
            };
        }
    },

    /**
     * Saves data to JSONBin (replaces entire bin contents)
     * @param {Object} data - { profile: {...}, trades: [...] }
     * @returns {Promise<boolean>} Success status
     */
    saveData: async (data) => {
        const url = `${BASE_URL}/${BIN_ID}`;

        try {
            console.log('📤 Saving data to JSONBin...');

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': MASTER_KEY
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('JSONBin PUT Error:', errorData);
                throw new Error(`Failed to save data: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Data saved successfully to JSONBin');
            return true;

        } catch (error) {
            console.error('❌ JSONBin save error:', error);
            throw error;
        }
    },

    /**
     * Validates the Master Key configuration
     * @returns {boolean} True if key appears to be configured
     */
    isConfigured: () => {
        return MASTER_KEY && !MASTER_KEY.includes('YOUR_MASTER_KEY_HERE');
    }
};
