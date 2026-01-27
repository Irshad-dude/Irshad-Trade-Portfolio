/**
 * Forex Trader Portfolio - Main Application Logic
 * Recreated to restore functionality
 */
import { CloudinaryService } from './cloudinary-service.js';
import { JSONBinService } from './jsonbin-service.js';

// State Management
const state = {
    isAdmin: false,
    trades: [], // Array of trade objects
    profile: {
        name: 'Irshad Sheikh',
        photo: null // Base64 or URL
    }
};

// DOM Elements
const DOM = {
    nav: {
        menu: document.querySelector('.nav-links'),
        hamburger: document.querySelector('.hamburger'),
        navbar: document.querySelector('.navbar'),
        profileIcon: document.querySelector('.nav-profile-icon'),
        navProfileImg: document.getElementById('navProfileImg')
    },
    admin: {
        loginBtn: document.getElementById('adminLoginBtn'),
        logoutBtn: document.getElementById('adminLogoutBtn'),
        dashboard: document.getElementById('adminDashboard'),
        loginModal: document.getElementById('loginModal'),
        loginForm: document.getElementById('loginForm'),
        passwordInput: document.getElementById('adminPassword'),
        closeModal: document.querySelector('.close-modal')
    },
    dashboard: {
        tabs: document.querySelectorAll('.tab-btn'),
        contents: document.querySelectorAll('.dashboard-tab-content'),
        uploadForm: document.getElementById('uploadForm'),
        removeProfileBtn: document.getElementById('removeProfileBtn'),
        profileInput: document.getElementById('profileInput'),
        currentProfileImg: document.getElementById('currentProfileImg')
    },
    library: {
        grid: document.getElementById('analysisGrid'),
        filters: {
            outcome: document.getElementById('filterOutcome'),
            instrument: document.getElementById('filterInstrument')
        }
    },
    profile: {
        mainImg: document.getElementById('mainProfileImg'),
        placeholder: document.getElementById('mainProfilePlaceholder')
    },
    modal: {
        container: document.getElementById('tradeModal'),
        closeBtn: document.getElementById('closeTradeModal'),
        img: document.getElementById('modalImg'),
        btnBefore: document.getElementById('btnBefore'),
        btnAfter: document.getElementById('btnAfter'),
        title: document.getElementById('modalTitle'),
        outcome: document.getElementById('modalOutcomeBadge'),
        instrument: document.getElementById('modalInstrument'),
        direction: document.getElementById('modalDirection'),
        rr: document.getElementById('modalRR'),
        timeframe: document.getElementById('modalTimeframe'),
        notes: document.getElementById('modalNotes')
    }
};

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    setupNavigation();
    setupAdminAuth();
    setupDashboard();
    setupLibrary();
    setupModal();

    // Load Data Async
    await loadState();

    renderLibrary();
    updateProfileUI();
});

// Navigation Logic
function setupNavigation() {
    // Hamburger Menu
    if (DOM.nav.hamburger) {
        DOM.nav.hamburger.addEventListener('click', () => {
            DOM.nav.menu.classList.toggle('active');
            DOM.nav.hamburger.classList.toggle('toggle');
        });
    }

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            DOM.nav.navbar.classList.add('scrolled');
        } else {
            DOM.nav.navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                DOM.nav.menu.classList.remove('active');
                if (DOM.nav.hamburger) DOM.nav.hamburger.classList.remove('toggle');
            }
        });
    });
}

// Data Persistence (JSONBin Global Storage)
async function loadState() {
    try {
        // Fetch from JSONBin (global data source)
        const data = await JSONBinService.fetchData();

        state.trades = data.trades || [];
        state.profile = data.profile || { name: 'Irshad Sheikh', photo: null };

        console.log(`✅ Loaded ${state.trades.length} trades from JSONBin`);
    } catch (error) {
        console.error('Error loading state from JSONBin:', error);
        // Fallback to empty state
        state.trades = [];
        state.profile = { name: 'Irshad Sheikh', photo: null };
    }
}

async function saveState() {
    try {
        const payload = {
            trades: state.trades,
            profile: state.profile
        };

        // Save to JSONBin (global persistence)
        await JSONBinService.saveData(payload);
        console.log('✅ State saved to JSONBin globally');
    } catch (error) {
        console.error('Error saving state to JSONBin:', error);
        alert('Warning: Failed to save data to JSONBin');
    }
}

function seedDummyData() {
    state.trades = [
        {
            id: '1',
            instrument: 'XAUUSD',
            timeframe: 'M15',
            direction: 'Buy',
            outcome: 'Win',
            rr: '1:4',
            date: '2024-12-28',
            notes: 'Classic liquidity sweep followed by a change of character. Entered on the FVG retest.',
            confidence: 5,
            imageBefore: null // Would be a URL
        },
        {
            id: '2',
            instrument: 'BTCUSD',
            timeframe: 'H4',
            direction: 'Sell',
            outcome: 'Loss',
            rr: '1:3',
            date: '2024-12-25',
            notes: 'Price tapped into H4 order block but failed to reject. Stop loss hit.',
            confidence: 3,
            imageBefore: null
        }
    ];
    saveState();
}

// Admin Authentication
function setupAdminAuth() {
    // Show Login Modal
    DOM.admin.loginBtn.addEventListener('click', () => {
        DOM.admin.loginModal.style.display = 'block';
    });

    // Close Modal
    if (DOM.admin.closeModal) {
        DOM.admin.closeModal.addEventListener('click', () => {
            DOM.admin.loginModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == DOM.admin.loginModal) {
            DOM.admin.loginModal.style.display = 'none';
        }
    });

    // Login Submit
    DOM.admin.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = DOM.admin.passwordInput.value;
        if (pwd === 'admin123') { // Simple hardcoded password
            state.isAdmin = true;
            toggleAdminUI(true);
            DOM.admin.loginModal.style.display = 'none';
            DOM.admin.passwordInput.value = '';
            alert('Admin Logged In');
        } else {
            alert('Incorrect Password');
        }
    });

    // Logout
    DOM.admin.logoutBtn.addEventListener('click', () => {
        state.isAdmin = false;
        toggleAdminUI(false);
        alert('Logged Out');
    });
}

function toggleAdminUI(isAdmin) {
    if (isAdmin) {
        DOM.admin.loginBtn.style.display = 'none';
        DOM.admin.logoutBtn.style.display = 'inline-block';
        DOM.admin.dashboard.style.display = 'block';
    } else {
        DOM.admin.loginBtn.style.display = 'inline-block';
        DOM.admin.logoutBtn.style.display = 'none';
        DOM.admin.dashboard.style.display = 'none';
    }
}

// Dashboard Functions
function setupDashboard() {
    // Tabs
    DOM.dashboard.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            DOM.dashboard.tabs.forEach(t => t.classList.remove('active'));
            DOM.dashboard.contents.forEach(c => c.classList.remove('active'));

            // Add to clicked
            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.getElementById(`tab-${target}`).classList.add('active');
        });
    });

    // New Trade Upload
    DOM.dashboard.uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = DOM.dashboard.uploadForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = 'Uploading...';

        try {
            // Handle image upload
            let imageBeforeUrl = null;
            let imageAfterUrl = null;

            const fileInputBefore = document.getElementById('fileInputBefore');
            const fileInputAfter = document.getElementById('fileInputAfter'); // Assuming this exists now

            if (fileInputBefore && fileInputBefore.files[0]) {
                try {
                    imageBeforeUrl = await CloudinaryService.uploadImage(fileInputBefore.files[0]);
                } catch (e) {
                    console.warn('Cloudinary upload failed, using placeholder', e);
                    // Use a local placeholder or null
                    imageBeforeUrl = null;
                    alert('Image upload failed (Cloudinary error). Trade will be logged without image.');
                }
            }
            if (fileInputAfter && fileInputAfter.files[0]) {
                try {
                    imageAfterUrl = await CloudinaryService.uploadImage(fileInputAfter.files[0]);
                } catch (e) {
                    console.warn('Cloudinary upload ignored', e);
                }
            }

            // Gather Form Data
            const trade = {
                id: Date.now().toString(),
                instrument: document.getElementById('tradeInstrument').value,
                timeframe: document.getElementById('tradeTimeframe').value,
                category: document.getElementById('tradeCategory').value,
                direction: document.getElementById('tradeDirection').value,
                rr: document.getElementById('tradeRR').value,
                outcome: document.getElementById('tradeOutcome').value,
                notes: document.getElementById('tradeNotes').value,
                date: new Date().toISOString().split('T')[0],
                confidence: document.querySelector('input[name="confidence"]:checked')?.value || '3',
                imageBefore: imageBeforeUrl,
                imageAfter: imageAfterUrl
            };

            // Add to state
            state.trades.unshift(trade); // Add to top
            saveState();
            renderLibrary();

            alert('Trade Logged Successfully');
            DOM.dashboard.uploadForm.reset();
            // Clear previews if implemented
            const previewBefore = document.getElementById('previewBefore');
            if (previewBefore) previewBefore.innerHTML = '';

        } catch (error) {
            console.error(error);
            alert('Error logging trade: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });

    // Profile Photo Upload (Cloudinary)
    DOM.dashboard.profileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Show Loading
            const originalSrc = DOM.dashboard.currentProfileImg.src;
            // You might want a spinner here

            try {
                const url = await CloudinaryService.uploadImage(file);
                state.profile.photo = url;
                saveState();
                updateProfileUI();
                alert('Profile photo updated!');
            } catch (error) {
                console.error(error);
                alert('Failed to upload profile photo');
            }
        }
    });

    DOM.dashboard.removeProfileBtn.addEventListener('click', () => {
        state.profile.photo = null;
        saveState();
        updateProfileUI();
    });
}

// Library & Rendering
const CATEGORIES = [
    'Order Blocks', 'FVG', 'SMC Confirmations', 'BOS',
    'Liquidity Grabs', 'Supply & Demand'
];

function setupLibrary() {
    // Populate Sidebar
    const tree = document.getElementById('folderTree');
    if (tree) { // Ensure element exists
        tree.innerHTML = `
            <li class="sidebar-menu-btn active" data-filter="all">
                <i class="fa-solid fa-folder-open"></i> All Trades
            </li>
            <li class="category-header" style="margin-top:20px; padding-left:5px;">Categories</li>
        `;

        CATEGORIES.forEach(cat => {
            const li = document.createElement('li');
            li.className = 'folder-item';
            li.setAttribute('data-category', cat);
            li.innerHTML = `<i class="fa-regular fa-folder"></i> ${cat}`;
            li.addEventListener('click', () => filterByCategory(cat, li));
            tree.appendChild(li);
        });

        // Add "All Trades" listener
        const allBtn = tree.querySelector('.sidebar-menu-btn');
        allBtn.addEventListener('click', () => filterByCategory('all', allBtn));
    }

    // Filters
    DOM.library.filters.outcome.addEventListener('change', renderLibrary);
    DOM.library.filters.instrument.addEventListener('change', renderLibrary);
}

let activeCategory = 'all';

function filterByCategory(cat, element) {
    activeCategory = cat;

    // Update active UI
    document.querySelectorAll('.sidebar-menu-btn, .folder-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    // Title
    const title = document.getElementById('activePath');
    if (title) title.innerText = cat === 'all' ? 'All Trades' : cat;

    renderLibrary();
}

function renderLibrary() {
    const grid = DOM.library.grid;
    grid.innerHTML = ''; // Clear

    const outcomeFilter = DOM.library.filters.outcome.value;
    const instrumentFilter = DOM.library.filters.instrument.value;

    const filteredTrades = state.trades.filter(trade => {
        const matchOutcome = outcomeFilter === 'all' || trade.outcome === outcomeFilter;
        const matchInstrument = instrumentFilter === 'all' || trade.instrument === instrumentFilter;
        const matchCategory = activeCategory === 'all' || trade.category === activeCategory;

        return matchOutcome && matchInstrument && matchCategory;
    });

    if (filteredTrades.length === 0) {
        grid.innerHTML = '<p class="text-gray" style="grid-column: 1/-1; text-align: center;">No trades found.</p>';
        return;
    }

    filteredTrades.forEach(trade => {
        const card = document.createElement('div');
        card.className = 'trade-card-new glass';

        // Stars
        const stars = parseInt(trade.confidence || 3);
        const starHtml = Array(5).fill(0).map((_, i) =>
            `<i class="fa-solid fa-star ${i < stars ? '' : 'text-gray'}" style="${i < stars ? 'color:var(--primary-gold)' : 'opacity:0.3'}"></i>`
        ).join('');

        // Badge Colors
        let badgeClass = 'badge-pending';
        if (trade.outcome === 'Win') badgeClass = 'badge-win';
        if (trade.outcome === 'Loss') badgeClass = 'badge-loss';
        if (trade.outcome === 'BE') badgeClass = 'badge-be';

        // Image (Use placeholder if null)
        const imgContent = trade.imageBefore
            ? `<img src="${trade.imageBefore}" alt="${trade.instrument}">`
            : `<div class="img-placeholder"><i class="fa-solid fa-chart-line"></i></div>`;

        card.innerHTML = `
            <div class="card-img-top">
                ${imgContent}
                <span class="badge-outcome ${badgeClass}">${trade.outcome}</span>
                <span class="badge-instrument">${trade.instrument}</span>
                <span class="card-date">${trade.date}</span>
            </div>
            <div class="card-body">
                <div class="card-title">
                    <span>${trade.direction} ${trade.instrument} <span class="text-small text-gray">(${trade.rr})</span></span>
                </div>
                <div class="card-meta">
                    <span><i class="fa-regular fa-clock"></i> ${trade.timeframe}</span>
                    <div class="card-stars">${starHtml}</div>
                </div>
                
                <div class="card-actions">
                    <button class="btn-details" onclick="openTradeDetails('${trade.id}')">
                        <i class="fa-solid fa-eye"></i> Details
                    </button>
                    <button class="btn-delete" title="Delete Trade" onclick="deleteTrade('${trade.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Global scope functions
window.deleteTrade = function (id) {
    if (confirm('Delete this trade?')) {
        state.trades = state.trades.filter(t => t.id !== id);
        saveState();
        renderLibrary();
    }
};

window.openTradeDetails = function (id) {
    const trade = state.trades.find(t => t.id === id);
    if (!trade) return;

    // Reset State
    currentTrade = trade;

    // Populate Modal
    DOM.modal.title.innerText = `${trade.direction} ${trade.instrument} Setup`;
    DOM.modal.instrument.innerText = trade.instrument;
    DOM.modal.direction.innerText = trade.direction;
    DOM.modal.rr.innerText = trade.rr;
    DOM.modal.timeframe.innerText = trade.timeframe;
    DOM.modal.notes.innerText = trade.notes;
    DOM.modal.outcome.innerText = trade.outcome;

    // Style Badge
    DOM.modal.outcome.className = '';
    if (trade.outcome === 'Win') DOM.modal.outcome.className = 'badge-win';
    else if (trade.outcome === 'Loss') DOM.modal.outcome.className = 'badge-loss';
    else DOM.modal.outcome.style.background = '#888';

    // Image Logic
    DOM.modal.img.src = trade.imageBefore || '';

    // Toggles
    DOM.modal.btnBefore.classList.add('active');
    DOM.modal.btnAfter.classList.remove('active');

    if (!trade.imageAfter) {
        DOM.modal.btnAfter.disabled = true;
        DOM.modal.btnAfter.title = "No After Image";
    } else {
        DOM.modal.btnAfter.disabled = false;
        DOM.modal.btnAfter.title = "View Result";
    }

    // Show Modal
    DOM.modal.container.style.display = 'block';
};

let currentTrade = null;

function setupModal() {
    // Close Click
    DOM.modal.closeBtn.addEventListener('click', () => {
        DOM.modal.container.style.display = 'none';
        currentTrade = null;
    });

    // Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === DOM.modal.container) {
            DOM.modal.container.style.display = 'none';
            currentTrade = null;
        }
    });

    // Toggle Before
    DOM.modal.btnBefore.addEventListener('click', () => {
        if (!currentTrade) return;
        DOM.modal.img.src = currentTrade.imageBefore || '';
        DOM.modal.btnBefore.classList.add('active');
        DOM.modal.btnAfter.classList.remove('active');
    });

    // Toggle After
    DOM.modal.btnAfter.addEventListener('click', () => {
        if (!currentTrade || !currentTrade.imageAfter) return;
        DOM.modal.img.src = currentTrade.imageAfter;
        DOM.modal.btnAfter.classList.add('active');
        DOM.modal.btnBefore.classList.remove('active');
    });
}

function updateProfileUI() {
    // Nav Icon
    if (state.profile.photo) {
        DOM.nav.profileIcon.style.display = 'block';
        DOM.nav.navProfileImg.src = state.profile.photo;

        // Main Profile
        DOM.profile.mainImg.src = state.profile.photo;
        DOM.profile.mainImg.style.display = 'block';
        DOM.profile.placeholder.style.display = 'none';

        // Dashboard Preview
        if (DOM.dashboard.currentProfileImg) DOM.dashboard.currentProfileImg.src = state.profile.photo;
    } else {
        DOM.nav.profileIcon.style.display = 'none';

        DOM.profile.mainImg.style.display = 'none';
        DOM.profile.placeholder.style.display = 'flex';

        if (DOM.dashboard.currentProfileImg) DOM.dashboard.currentProfileImg.src = '';
    }
}
