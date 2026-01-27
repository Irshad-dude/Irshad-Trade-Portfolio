/**
 * Forex Trader Portfolio - Standalone Admin Portal Logic
 */
import { CloudinaryService } from './cloudinary-service.js';
import { JSONBinService } from './jsonbin-service.js';

// DOM Elements
const DOM = {
    login: {
        section: document.getElementById('loginSection'),
        form: document.getElementById('loginForm'),
        logoutBtn: document.getElementById('logoutBtn')
    },
    dashboard: {
        section: document.getElementById('dashboardSection'),
        tabs: document.querySelectorAll('.tab-btn'),
        contents: document.querySelectorAll('.dashboard-tab-content'),
        uploadForm: document.getElementById('uploadForm'),

        // Profile
        profileInput: document.getElementById('profileInput'),
        removeProfileBtn: document.getElementById('removeProfileBtn'),
        currentProfileImg: document.getElementById('currentProfileImg'),

        // Previews
        previewBefore: document.getElementById('previewBefore'),
        previewAfter: document.getElementById('previewAfter'),
        dropZoneBefore: document.getElementById('dropZoneBefore'),
        dropZoneAfter: document.getElementById('dropZoneAfter')
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth
    checkAuth();

    // Setup Listeners
    setupAuthListeners();
    setupDashboardTabs();
    setupTradeUpload();
    setupProfileUpload();

    // Load Initial Data
    loadProfile();
});

// Authentication
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    toggleAdminUI(isLoggedIn);
}

function toggleAdminUI(isLoggedIn) {
    if (isLoggedIn) {
        DOM.login.section.style.display = 'none';
        DOM.dashboard.section.style.display = 'block';
        DOM.login.logoutBtn.style.display = 'block';
    } else {
        DOM.login.section.style.display = 'block';
        DOM.dashboard.section.style.display = 'none';
        DOM.login.logoutBtn.style.display = 'none';
    }
}

function setupAuthListeners() {
    DOM.login.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = document.getElementById('password').value;
        if (pwd === 'admin123') {
            sessionStorage.setItem('adminLoggedIn', 'true');
            toggleAdminUI(true);
            DOM.login.form.reset();
        } else {
            alert('Invalid Credentials');
        }
    });

    DOM.login.logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('adminLoggedIn');
        toggleAdminUI(false);
    });
}

// Dashboard Tabs
function setupDashboardTabs() {
    DOM.dashboard.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            DOM.dashboard.tabs.forEach(t => t.classList.remove('active'));
            DOM.dashboard.contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.getElementById(`tab-${target}`).classList.add('active');
        });
    });
}

// Trade Upload Logic
function setupTradeUpload() {
    // Image Preview Handlers
    setupImagePreview('fileInputBefore', 'previewBefore', 'dropZoneBefore');
    setupImagePreview('fileInputAfter', 'previewAfter', 'dropZoneAfter');

    // Form Submit
    DOM.dashboard.uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = DOM.dashboard.uploadForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

        try {
            // Upload Images
            let beforeUrl = null;
            let afterUrl = null;

            const fileBefore = document.getElementById('fileInputBefore').files[0];
            const fileAfter = document.getElementById('fileInputAfter').files[0];

            if (fileBefore) beforeUrl = await CloudinaryService.uploadImage(fileBefore);
            if (fileAfter) afterUrl = await CloudinaryService.uploadImage(fileAfter);

            if (!beforeUrl) {
                // If no image uploaded, warn user? Or allow text-only? 
                // Requirement says "Before Entry (Required)"
                if (!confirm("No 'Before' image selected. Proceed anyway?")) {
                    throw new Error("Cancelled by user");
                }
            }

            // Create Trade Object
            const newTrade = {
                id: Date.now().toString(),
                instrument: document.getElementById('tradeInstrument').value,
                timeframe: document.getElementById('tradeTimeframe').value,
                category: document.getElementById('tradeCategory').value,
                direction: document.getElementById('tradeDirection').value,
                outcome: document.getElementById('tradeOutcome').value,
                rr: document.getElementById('tradeRR').value,
                notes: document.getElementById('tradeNotes').value,
                confidence: document.querySelector('input[name="confidence"]:checked')?.value || '3',
                date: new Date().toISOString().split('T')[0],
                imageBefore: beforeUrl,
                imageAfter: afterUrl
            };

            // Save
            saveTrade(newTrade);

            alert('Trade Logged Successfully!');
            DOM.dashboard.uploadForm.reset();
            resetPreviews();

        } catch (error) {
            console.error(error);
            if (error.message !== "Cancelled by user") alert('Upload Failed: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        }
    });
}

function setupImagePreview(inputId, previewId, dropZoneId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const dropZone = document.getElementById(dropZoneId);

    // Click to Open
    dropZone.addEventListener('click', () => input.click());

    // File Selection
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                preview.innerHTML = `<img src="${ev.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Drag and Drop (Simple visual)
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary-gold)';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--glass-border)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--glass-border)';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            input.files = e.dataTransfer.files; // Assign to input
            // Trigger change event manually
            const event = new Event('change');
            input.dispatchEvent(event);
        }
    });
}

function resetPreviews() {
    DOM.dashboard.previewBefore.style.display = 'none';
    DOM.dashboard.previewBefore.innerHTML = '';

    DOM.dashboard.previewAfter.style.display = 'none';
    DOM.dashboard.previewAfter.innerHTML = '';
}

// Profile Upload Logic
function setupProfileUpload() {
    DOM.dashboard.profileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Show loading state
            const originalSrc = DOM.dashboard.currentProfileImg.src;
            DOM.dashboard.currentProfileImg.style.opacity = '0.5';

            try {
                // Upload to Cloudinary
                const url = await CloudinaryService.uploadImage(file);

                // Fetch current data from JSONBin
                const data = await JSONBinService.fetchData();

                // Update profile photo
                data.profile = { photo: url, name: data.profile?.name || 'Irshad Sheikh' };

                // Save to JSONBin (global persistence)
                await JSONBinService.saveData(data);

                // UI Update
                DOM.dashboard.currentProfileImg.src = url;
                DOM.dashboard.currentProfileImg.style.opacity = '1';
                alert('Profile Photo Updated Globally!');

            } catch (error) {
                console.error(error);
                alert('Profile Upload Failed: ' + error.message);
                DOM.dashboard.currentProfileImg.style.opacity = '1';
            }
        }
    });

    DOM.dashboard.removeProfileBtn.addEventListener('click', async () => {
        if (confirm('Remove profile photo?')) {
            try {
                // Fetch current data from JSONBin
                const data = await JSONBinService.fetchData();

                // Remove photo
                if (data.profile) {
                    data.profile.photo = null;
                }

                // Save to JSONBin
                await JSONBinService.saveData(data);

                DOM.dashboard.currentProfileImg.src = '';
                alert('Profile photo removed');
            } catch (e) {
                console.error(e);
                alert('Error removing photo: ' + e.message);
            }
        }
    });
}

async function loadProfile() {
    try {
        // Fetch from JSONBin (global data)
        const data = await JSONBinService.fetchData();
        const profile = data.profile || {};

        if (profile.photo) {
            if (DOM.dashboard.currentProfileImg) {
                DOM.dashboard.currentProfileImg.src = profile.photo;
            }
        }

        console.log('✅ Profile loaded from JSONBin');
    } catch (e) {
        console.error('Error loading profile:', e);
    }
}

// Shared Data Logic
async function saveTrade(trade) {
    try {
        // Fetch current data from JSONBin
        const data = await JSONBinService.fetchData();
        const trades = data.trades || [];

        // Add new trade to the beginning
        trades.unshift(trade);

        // Save to JSONBin (global persistence)
        await JSONBinService.saveData({ ...data, trades });

        console.log('✅ Trade saved to JSONBin globally');
    } catch (e) {
        console.error('Error saving trade:', e);
        alert('Error saving to JSONBin: ' + e.message);
        throw e;
    }
}
