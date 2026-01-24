// ============================================
// VibeCheck.BNB - Main JavaScript
// ============================================

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.setupToggle();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
        localStorage.setItem('theme', theme);
        this.updateToggleIcon();
    }

    updateToggleIcon() {
        const toggleBtns = document.querySelectorAll('.theme-toggle i');
        toggleBtns.forEach(btn => {
            if (this.theme === 'dark') {
                btn.className = 'fas fa-sun';
            } else {
                btn.className = 'fas fa-moon';
            }
        });
    }

    toggle() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    setupToggle() {
        const toggleBtns = document.querySelectorAll('.theme-toggle');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => this.toggle());
        });
    }
}

// Input Management
class InputManager {
    constructor() {
        this.input = document.getElementById('blockchainInput');
        this.clearBtn = document.getElementById('clearBtn');
        
        if (this.input && this.clearBtn) {
            this.init();
        }
    }

    init() {
        // Show/hide clear button
        this.input.addEventListener('input', () => {
            if (this.input.value.length > 0) {
                this.clearBtn.classList.add('visible');
            } else {
                this.clearBtn.classList.remove('visible');
            }
        });

        // Clear button click
        this.clearBtn.addEventListener('click', () => {
            this.input.value = '';
            this.clearBtn.classList.remove('visible');
            this.input.focus();
        });

        // Enter key to check vibe
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.input.value.trim().length > 0) {
                this.checkVibe();
            }
        });
    }

    validateInput(value) {
        // Check if it looks like a valid blockchain hash or address
        const patterns = {
            txHash: /^0x[a-fA-F0-9]{64}$/,
            address: /^0x[a-fA-F0-9]{40}$/,
            general: /^0x[a-fA-F0-9]+$/
        };

        return patterns.general.test(value);
    }

    getValue() {
        return this.input.value.trim();
    }

    checkVibe() {
        const value = this.getValue();
        
        if (!value) {
            this.showError('Please enter a transaction hash or address');
            return;
        }

        if (!this.validateInput(value)) {
            this.showError('Please enter a valid blockchain hash (must start with 0x)');
            return;
        }

        // Store input in sessionStorage for the result page
        sessionStorage.setItem('vibeInput', value);
        
        // Navigate to result page with loading animation
        this.navigateToResult();
    }

    showError(message) {
        // Create error tooltip
        const existingError = document.querySelector('.input-error');
        if (existingError) {
            existingError.remove();
        }

        const error = document.createElement('div');
        error.className = 'input-error';
        error.textContent = message;
        error.style.cssText = `
            position: absolute;
            bottom: -2.5rem;
            left: 0;
            right: 0;
            background: var(--status-risky);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            text-align: center;
            animation: fadeInUp 0.3s ease;
        `;

        const wrapper = this.input.closest('.input-wrapper');
        wrapper.style.position = 'relative';
        wrapper.parentElement.appendChild(error);

        // Shake animation for input
        wrapper.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            wrapper.style.animation = '';
        }, 500);

        // Remove error after 3 seconds
        setTimeout(() => {
            error.remove();
        }, 3000);
    }

    navigateToResult() {
        // Add loading state
        const checkBtn = document.getElementById('checkVibeBtn');
        if (checkBtn) {
            checkBtn.innerHTML = `
                <span>Analyzing...</span>
                <i class="fas fa-spinner fa-spin"></i>
            `;
            checkBtn.disabled = true;
        }

        // Simulate processing time
        setTimeout(() => {
            window.location.href = 'result.html';
        }, 1000);
    }
}

// Demo Mode
class DemoManager {
    constructor() {
        this.setupDemoButtons();
    }

    setupDemoButtons() {
        // Try Demo button
        const tryDemoBtn = document.getElementById('tryDemoBtn');
        if (tryDemoBtn) {
            tryDemoBtn.addEventListener('click', () => this.loadDemo());
        }

        // CTA Check button
        const ctaCheckBtn = document.getElementById('ctaCheckBtn');
        if (ctaCheckBtn) {
            ctaCheckBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                const input = document.getElementById('blockchainInput');
                if (input) {
                    setTimeout(() => input.focus(), 500);
                }
            });
        }

        // Demo link in footer
        const demoLink = document.getElementById('demoLink');
        if (demoLink) {
            demoLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadDemo();
            });
        }
    }

    loadDemo() {
        // Set demo flag
        sessionStorage.setItem('demoMode', 'true');
        sessionStorage.setItem('vibeInput', '0x742d35cc6634c0532925a3b844bc9e7595f0beb7e1a1234567890abcdef12345');
        
        // Navigate to result page
        window.location.href = 'result.html';
    }
}

// Result Page Manager
class ResultManager {
    constructor() {
        if (window.location.pathname.includes('result.html')) {
            this.init();
        }
    }

    init() {
        this.loadData();
        this.setupActions();
        this.animateEntrance();
    }

    loadData() {
        const input = sessionStorage.getItem('vibeInput');
        const isDemo = sessionStorage.getItem('demoMode') === 'true';

        if (!input) {
            // No input data, show default demo
            this.loadDemoData();
            return;
        }

        // Display the input hash
        const txHashEl = document.getElementById('txHash');
        if (txHashEl && input) {
            txHashEl.textContent = this.shortenHash(input);
        }

        // Load appropriate data based on demo mode
        if (isDemo) {
            this.loadDemoData();
            sessionStorage.removeItem('demoMode'); // Clear demo flag
        } else {
            this.loadDemoData(); // For now, always show demo data
            // In production, this would fetch real blockchain data
        }
    }

    loadDemoData() {
        // This is the demo data matching the HTML content
        // In production, this would be replaced with real API calls
        
        const demoData = {
            status: 'risky',
            statusIcon: '🔴',
            statusText: 'Risky',
            statusTitle: 'Exercise Extreme Caution',
            statusSubtitle: 'Analysis completed in 1.8s',
            explanation: 'This transaction sent 0.5 BNB from your wallet to a new token contract that has only existed for 2 hours and has no verified source code.',
            txHash: '0x742d35...f12345',
            blockNumber: '34,567,890',
            timestamp: '2 hours ago',
            vibe: 'This contract feels rushed and opaque. The combination of no source code verification, centralized ownership, and extremely low liquidity creates a high-risk environment. Similar patterns have led to rug pulls in the past. Proceed with extreme caution or avoid entirely.',
            riskLevel: 75
        };

        this.updateStatusBanner(demoData);
        this.updateVibeMeter(demoData.riskLevel);
    }

    updateStatusBanner(data) {
        const statusBadge = document.getElementById('statusBadge');
        const statusTitle = document.getElementById('statusTitle');
        const statusSubtitle = document.getElementById('statusSubtitle');

        if (statusBadge) {
            statusBadge.querySelector('.status-icon').textContent = data.statusIcon;
            statusBadge.querySelector('.status-text').textContent = data.statusText;
            
            // Update badge color based on status
            const bgColors = {
                chill: 'var(--status-chill-bg)',
                caution: 'var(--status-caution-bg)',
                risky: 'var(--status-risky-bg)'
            };
            const textColors = {
                chill: 'var(--status-chill)',
                caution: 'var(--status-caution)',
                risky: 'var(--status-risky)'
            };
            
            statusBadge.style.background = bgColors[data.status];
            statusBadge.style.color = textColors[data.status];
        }

        if (statusTitle) statusTitle.textContent = data.statusTitle;
        if (statusSubtitle) statusSubtitle.textContent = data.statusSubtitle;
    }

    updateVibeMeter(riskLevel) {
        const meterFill = document.getElementById('meterFill');
        if (meterFill) {
            // Animate the meter fill
            setTimeout(() => {
                meterFill.style.width = `${riskLevel}%`;
            }, 500);
        }
    }

    setupActions() {
        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareVibe());
        }

        // Deeper check button
        const deeperCheckBtn = document.getElementById('deeperCheckBtn');
        if (deeperCheckBtn) {
            deeperCheckBtn.addEventListener('click', () => this.runDeeperCheck());
        }

        // Similar cards
        const similarCards = document.querySelectorAll('.similar-card');
        similarCards.forEach(card => {
            card.addEventListener('click', () => {
                // Scroll to top and show input
                window.location.href = 'index.html';
            });
        });
    }

    shareVibe() {
        const url = window.location.href;
        const text = 'Check out this vibe analysis on VibeCheck.BNB';

        if (navigator.share) {
            navigator.share({
                title: 'VibeCheck.BNB Analysis',
                text: text,
                url: url
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Link copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }
    }

    runDeeperCheck() {
        this.showNotification('Deep analysis feature coming soon!', 'info');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        const bgColors = {
            success: 'var(--status-chill)',
            info: 'var(--accent-primary)',
            warning: 'var(--status-caution)',
            error: 'var(--status-risky)'
        };
        
        notification.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${bgColors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    animateEntrance() {
        // Animate all cards on entrance
        const cards = document.querySelectorAll('.card, .status-banner');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    shortenHash(hash) {
        if (!hash || hash.length < 16) return hash;
        return `${hash.substring(0, 10)}...${hash.substring(hash.length - 6)}`;
    }
}

// Navigation Enhancement
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.highlightCurrentPage();
        this.setupSmoothScroll();
    }

    highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href');
            
            if (currentPath.includes(linkPath) || 
                (currentPath.endsWith('/') && linkPath === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Intersection Observer for Animations
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all feature cards, philosophy cards, etc.
        const elementsToAnimate = document.querySelectorAll(
            '.feature-card, .philosophy-card, .value-item, .story-card, .mission-card'
        );

        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            observer.observe(el);
        });
    }
}

// Add custom animations to CSS via JavaScript
function addCustomAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Check Vibe Button Handler
function setupCheckVibeButton() {
    const checkVibeBtn = document.getElementById('checkVibeBtn');
    if (checkVibeBtn) {
        checkVibeBtn.addEventListener('click', () => {
            const inputManager = new InputManager();
            inputManager.checkVibe();
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add custom animations
    addCustomAnimations();
    
    // Initialize managers
    const themeManager = new ThemeManager();
    const inputManager = new InputManager();
    const demoManager = new DemoManager();
    const resultManager = new ResultManager();
    const navigationManager = new NavigationManager();
    const animationManager = new AnimationManager();
    
    // Setup check vibe button
    setupCheckVibeButton();
    
    // Console easter egg
    console.log('%c🌊 VibeCheck.BNB', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
    console.log('%cDon\'t just read the blockchain. Check the vibe.', 'font-size: 14px; color: #64748b;');
    console.log('%cBuilt with calm intelligence for the Web3 community 💜', 'font-size: 12px; color: #94a3b8;');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh any time-sensitive data when user returns to tab
        if (window.location.pathname.includes('result.html')) {
            const timestampEl = document.getElementById('timestamp');
            if (timestampEl) {
                // Update relative time if needed
                // This would be implemented with real-time updates in production
            }
        }
    }
});

// Prevent form submission if any forms exist
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });
});

// Export for use in other scripts if needed
window.VibeCheck = {
    ThemeManager,
    InputManager,
    DemoManager,
    ResultManager,
    NavigationManager,
    AnimationManager
};