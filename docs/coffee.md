# ☕ Coffee

Here's a map of some great coffee spots I've discovered during my travels and daily life.

*Feel free to reach out if you have recommendations for places I should try!*

---

<!-- Interactive Map Section -->
<div class="coffee-map-section">
    <div class="map-header">
        <h3>Where I've had good coffee</h3>
        <div class="map-controls">
            <button class="fullscreen-btn" id="fullscreenBtn" title="View in fullscreen">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
            </button>
        </div>
    </div>
    
    <div class="coffee-map-container" id="mapContainer">
        <!-- Loading skeleton -->
        <div class="map-skeleton" id="mapSkeleton">
            <div class="skeleton-header"></div>
            <div class="skeleton-content">
                <div class="skeleton-pin"></div>
                <div class="skeleton-pin"></div>
                <div class="skeleton-pin"></div>
            </div>
            <div class="loading-text">Loading coffee map...</div>
        </div>
        
        <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1xVIGlYMClwpJCnYr8KO1CYMkCI-Puys&ehbc=2E312F" 
                width="100%" 
                height="500" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
                id="coffeeMap"
                onload="hideMapSkeleton()">
        </iframe>
    </div>
</div>


<style>


/* Map Section Styles */
.coffee-map-section {
    margin: 60px 0;
}

.map-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 10px;
}

.map-header h3 {
    margin: 0;
    color: var(--md-typeset-color);
    font-size: 1.4rem;
}

.map-controls {
    display: flex;
    gap: 10px;
}

.fullscreen-btn {
    background: var(--md-primary-fg-color, #00A388);
    border: none;
    border-radius: 8px;
    color: white;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
}

.fullscreen-btn:hover {
    background: #00C49A;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 163, 136, 0.3);
}

.fullscreen-btn:active {
    transform: translateY(0);
}

/* Map Container Styles */
.coffee-map-container {
    margin: 30px 0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 163, 136, 0.15);
    border: 2px solid rgba(0, 163, 136, 0.1);
    transition: all 0.4s ease;
    position: relative;
    background: linear-gradient(135deg, rgba(0, 163, 136, 0.02), rgba(0, 196, 154, 0.02));
}

.coffee-map-container:hover {
    box-shadow: 0 16px 48px rgba(0, 163, 136, 0.25);
    transform: translateY(-4px);
    border-color: rgba(0, 163, 136, 0.2);
}

.coffee-map-container iframe {
    border: none;
    display: block;
    transition: all 0.3s ease;
    opacity: 1;
}

/* Loading Skeleton */
.map-skeleton {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    display: flex;
    flex-direction: column;
    z-index: 10;
    transition: opacity 0.5s ease;
}

.skeleton-header {
    height: 60px;
    background: linear-gradient(90deg, rgba(0, 163, 136, 0.1) 0%, rgba(0, 196, 154, 0.1) 100%);
    animation: pulse 2s infinite;
}

.skeleton-content {
    flex: 1;
    position: relative;
    background: #f1f3f4;
}

.skeleton-pin {
    position: absolute;
    width: 20px;
    height: 20px;
    background: var(--md-primary-fg-color, #00A388);
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    animation: pulse 2s infinite;
}

.skeleton-pin:nth-child(1) {
    top: 30%;
    left: 40%;
    animation-delay: 0.5s;
}

.skeleton-pin:nth-child(2) {
    top: 50%;
    right: 30%;
    animation-delay: 1s;
}

.skeleton-pin:nth-child(3) {
    bottom: 40%;
    left: 60%;
    animation-delay: 1.5s;
}

.loading-text {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: var(--md-primary-fg-color, #00A388);
    font-weight: 500;
    animation: fadeInOut 2s infinite;
}

/* Fullscreen Styles */
.fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.95);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.3s ease;
}

.fullscreen-header {
    padding: 20px;
    background: rgba(0, 163, 136, 0.1);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.fullscreen-header h3 {
    margin: 0;
    color: white;
}

.close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 8px;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.fullscreen-map {
    flex: 1;
    border: none;
}

/* Animations */
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

@keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
}

@keyframes fadeInOut {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Responsive Design */
@media (max-width: 768px) {
    
    .coffee-map-container {
        margin: 20px -16px;
        border-radius: 0;
        box-shadow: 0 4px 16px rgba(0, 163, 136, 0.1);
    }
    
    .coffee-map-container iframe {
        height: 400px;
    }
    
    .map-header {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .coffee-map-container iframe {
        height: 350px;
    }
}

/* Dark Mode Adjustments */
@media (prefers-color-scheme: dark) {
    .coffee-map-container {
        border: 2px solid rgba(0, 163, 136, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        background: linear-gradient(135deg, rgba(0, 163, 136, 0.05), rgba(0, 196, 154, 0.05));
    }
    
    .coffee-map-container:hover {
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
        border-color: rgba(0, 163, 136, 0.3);
    }
    
    
    .map-skeleton {
        background: linear-gradient(135deg, #2d3748, #1a202c);
    }
    
    .skeleton-content {
        background: #374151;
    }
}

[data-md-color-scheme="slate"] .coffee-map-container {
    border: 2px solid rgba(0, 163, 136, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    background: linear-gradient(135deg, rgba(0, 163, 136, 0.05), rgba(0, 196, 154, 0.05));
}

[data-md-color-scheme="slate"] .coffee-map-container:hover {
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
    border-color: rgba(0, 163, 136, 0.3);
}


</style>


<script>
function hideMapSkeleton() {
    const skeleton = document.getElementById('mapSkeleton');
    if (skeleton) {
        skeleton.style.opacity = '0';
        setTimeout(() => {
            skeleton.style.display = 'none';
        }, 500);
    }
}

function toggleFullscreen() {
    const mapContainer = document.getElementById('mapContainer');
    const map = document.getElementById('coffeeMap');
    
    if (!document.fullscreenElement) {
        // Create fullscreen overlay
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.id = 'fullscreenOverlay';
        
        const header = document.createElement('div');
        header.className = 'fullscreen-header';
        header.innerHTML = `
            <h3>☕ My Coffee Spots</h3>
            <button class="close-btn" id="closeFullscreenBtn">✕ Close</button>
        `;
        
        const fullscreenMap = map.cloneNode(true);
        fullscreenMap.className = 'fullscreen-map';
        fullscreenMap.id = 'fullscreenMap';
        
        overlay.appendChild(header);
        overlay.appendChild(fullscreenMap);
        document.body.appendChild(overlay);
        
        // Add close button event listener
        const closeBtn = document.getElementById('closeFullscreenBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', exitFullscreen);
        }
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }
}

function exitFullscreen() {
    const overlay = document.getElementById('fullscreenOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Add event listener for fullscreen button
document.addEventListener('DOMContentLoaded', function() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Add keyboard shortcut (Escape to exit fullscreen)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            exitFullscreen();
        }
    });
});

// Animate stats on scroll
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                if (finalValue !== '∞') {
                    let currentValue = 0;
                    const increment = parseInt(finalValue) / 30;
                    
                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= parseInt(finalValue)) {
                            target.textContent = finalValue;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(currentValue);
                        }
                    }, 50);
                }
                observer.unobserve(target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', animateStats);
</script>

---
