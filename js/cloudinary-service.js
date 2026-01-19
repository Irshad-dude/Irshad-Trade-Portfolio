/**
 * Cloudinary Service
 * Handles image uploads to Cloudinary
 */

const CLOUD_NAME = 'dooo6u0qc';
const UPLOAD_PRESET = 'Trade Port'; // Unsigned preset
const FOLDER = 'Trade';

export const CloudinaryService = {
    /**
     * Uploads an image file to Cloudinary
     * @param {File} file 
     * @returns {Promise<string>} The secure URL of the uploaded image
     */
    uploadImage: async (file) => {
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', FOLDER);

        try {
            console.log('Starting Cloudinary upload...');
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Cloudinary Error Details:', errorData);
                throw new Error(`Upload failed: ${errorData.error.message}`);
            }

            const data = await response.json();
            console.log('Upload successful:', data.secure_url);
            return data.secure_url;

        } catch (error) {
            console.error('Cloudinary Upload Error:', error);
            throw error;
        }
    }
};
