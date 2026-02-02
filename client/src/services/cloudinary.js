/**
 * Cloudinary Upload Service
 * Uploads images to Cloudinary and returns the URL
 */

const CLOUD_NAME = 'dooo6u0qc';
const UPLOAD_PRESET = 'Trade Port'; // Unsigned preset
const FOLDER = 'Trade';

export const cloudinaryService = {
    /**
     * Upload an image file to Cloudinary
     * @param {File} file - The image file to upload
     * @returns {Promise<string>} - The uploaded image URL
     */
    async uploadImage(file) {
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
                throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
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

export default cloudinaryService;
