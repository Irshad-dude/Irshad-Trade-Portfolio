/**
 * API Client (FRONTEND - Browser-Safe)
 * Calls backend Express API routes to interact with JSONBin
 * No Master Key exposed - secure and Vercel-compatible
 */

export const APIClient = {
    /**
     * Fetches data from JSONBin via backend API
     * @returns {Promise<Object>} { profile: {...}, trades: [...] }
     */
    fetchData: async () => {
        try {
            console.log('📥 Fetching data from backend API...');

            const response = await fetch('/api/jsonbin/data');

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }

            const data = await response.json();
            console.log(`✅ Loaded ${data.trades?.length || 0} trades from backend`);

            return data;

        } catch (error) {
            console.error('❌ API fetch error:', error);
            // Return empty state as fallback
            return {
                profile: { name: 'Irshad Sheikh', photo: null },
                trades: []
            };
        }
    },

    /**
     * Saves data to JSONBin via backend API
     * @param {Object} data - { profile: {...}, trades: [...] }
     * @returns {Promise<boolean>} Success status
     */
    saveData: async (data) => {
        try {
            console.log('📤 Saving data via backend API...');

            const response = await fetch('/api/jsonbin/data', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save data');
            }

            console.log('✅ Data saved successfully via backend');
            return true;

        } catch (error) {
            console.error('❌ API save error:', error);
            throw error;
        }
    }
};
