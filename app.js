class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 4;
        this.slides = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.slideCounter = null;
        
        this.init();
    }
    
    init() {
        // Get DOM elements
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.slideCounter = document.getElementById('slideCounter');
        
        // Ensure DOM elements exist before proceeding
        if (!this.prevBtn || !this.nextBtn || !this.slideCounter || this.slides.length === 0) {
            console.error('Required presentation elements not found');
            return;
        }
        
        console.log('Initializing presentation with', this.slides.length, 'slides');
        
        this.updateSlideDisplay();
        this.updateNavigationButtons();
        this.bindEvents();
        this.addAccessibilityAttributes();
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        console.log('Presentation initialized successfully');
    }
    
    addAccessibilityAttributes() {
        // Add ARIA attributes to slides
        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-labelledby', `slide-heading-${index + 1}`);
            slide.setAttribute('tabindex', index === 0 ? '0' : '-1');
            
            const heading = slide.querySelector('h1');
            if (heading) {
                heading.id = `slide-heading-${index + 1}`;
            }
        });
        
        // Add ARIA attributes to navigation
        this.prevBtn.setAttribute('aria-label', 'Go to previous slide');
        this.nextBtn.setAttribute('aria-label', 'Go to next slide');
        this.slideCounter.setAttribute('aria-live', 'polite');
        this.slideCounter.setAttribute('aria-label', 'Current slide number');
    }
    
    bindEvents() {
        console.log('Binding button events...');
        
        // Clear any existing handlers
        const newPrevBtn = this.prevBtn.cloneNode(true);
        const newNextBtn = this.nextBtn.cloneNode(true);
        this.prevBtn.parentNode.replaceChild(newPrevBtn, this.prevBtn);
        this.nextBtn.parentNode.replaceChild(newNextBtn, this.nextBtn);
        this.prevBtn = newPrevBtn;
        this.nextBtn = newNextBtn;
        
        // Add click event listeners with proper binding
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Previous button clicked!');
            this.previousSlide();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Next button clicked!');
            this.nextSlide();
        });
        
        // Add additional event listeners for better compatibility
        this.prevBtn.addEventListener('mousedown', (e) => {
            console.log('Previous button mouse down');
        });
        
        this.nextBtn.addEventListener('mousedown', (e) => {
            console.log('Next button mouse down');
        });
        
        // Add touch support for mobile
        this.addTouchSupport();
        
        console.log('Button events bound successfully');
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        let isDragging = false;
        
        const presentationContainer = document.querySelector('.presentation-container');
        
        presentationContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });
        
        presentationContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            if (diffX > diffY && diffX > 30) {
                e.preventDefault();
            }
        }, { passive: false });
        
        presentationContainer.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
            isDragging = false;
        }, { passive: true });
        
        presentationContainer.addEventListener('touchcancel', () => {
            isDragging = false;
        }, { passive: true });
    }
    
    handleSwipe(startX, startY, endX, endY) {
        const swipeThreshold = 50;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }
    
    handleKeyboard(e) {
        // Don't handle keyboard events if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case 'PageDown':
            case ' ': // Spacebar
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                break;
        }
    }
    
    nextSlide() {
        console.log('Next slide method called, current:', this.currentSlide, 'total:', this.totalSlides);
        
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
            console.log('Moving to slide:', this.currentSlide);
            this.updateSlideDisplay();
            this.updateNavigationButtons();
            this.announceSlideChange();
            this.focusCurrentSlide();
        } else {
            console.log('Already at last slide');
        }
    }
    
    previousSlide() {
        console.log('Previous slide method called, current:', this.currentSlide);
        
        if (this.currentSlide > 1) {
            this.currentSlide--;
            console.log('Moving to slide:', this.currentSlide);
            this.updateSlideDisplay();
            this.updateNavigationButtons();
            this.announceSlideChange();
            this.focusCurrentSlide();
        } else {
            console.log('Already at first slide');
        }
    }
    
    goToSlide(slideNumber) {
        console.log('Going to slide:', slideNumber);
        if (slideNumber >= 1 && slideNumber <= this.totalSlides && slideNumber !== this.currentSlide) {
            this.currentSlide = slideNumber;
            this.updateSlideDisplay();
            this.updateNavigationButtons();
            this.announceSlideChange();
            this.focusCurrentSlide();
        }
    }
    
    updateSlideDisplay() {
        console.log('Updating slide display, showing slide:', this.currentSlide);
        
        this.slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            
            if (slideNumber === this.currentSlide) {
                slide.classList.add('active');
                slide.setAttribute('aria-hidden', 'false');
                slide.setAttribute('tabindex', '0');
                
                const slideContent = slide.querySelector('.slide-content');
                if (slideContent) {
                    slideContent.scrollTop = 0;
                }
                slide.scrollTop = 0;
                
                console.log('Slide', slideNumber, 'is now active');
            } else {
                slide.classList.remove('active');
                slide.setAttribute('aria-hidden', 'true');
                slide.setAttribute('tabindex', '-1');
            }
        });
        
        // Update slide counter
        this.slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
        this.slideCounter.setAttribute('aria-label', `Slide ${this.currentSlide} of ${this.totalSlides}`);
    }
    
    updateNavigationButtons() {
        console.log('Updating navigation buttons for slide:', this.currentSlide);
        
        // Update previous button state
        if (this.currentSlide === 1) {
            this.prevBtn.disabled = true;
            this.prevBtn.setAttribute('aria-disabled', 'true');
            this.prevBtn.setAttribute('aria-label', 'Go to previous slide (disabled, at first slide)');
            console.log('Previous button disabled');
        } else {
            this.prevBtn.disabled = false;
            this.prevBtn.setAttribute('aria-disabled', 'false');
            this.prevBtn.setAttribute('aria-label', `Go to previous slide (slide ${this.currentSlide - 1})`);
            console.log('Previous button enabled');
        }
        
        // Update next button state
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.disabled = true;
            this.nextBtn.setAttribute('aria-disabled', 'true');
            this.nextBtn.setAttribute('aria-label', 'Go to next slide (disabled, at last slide)');
            console.log('Next button disabled');
        } else {
            this.nextBtn.disabled = false;
            this.nextBtn.setAttribute('aria-disabled', 'false');
            this.nextBtn.setAttribute('aria-label', `Go to next slide (slide ${this.currentSlide + 1})`);
            console.log('Next button enabled');
        }
    }
    
    focusCurrentSlide() {
        const currentSlideElement = this.slides[this.currentSlide - 1];
        if (currentSlideElement) {
            const heading = currentSlideElement.querySelector('h1');
            if (heading) {
                setTimeout(() => {
                    heading.focus({ preventScroll: true });
                }, 150);
            }
        }
    }
    
    announceSlideChange() {
        // Create announcement for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.cssText = `
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        `;
        
        const slideTitle = this.slides[this.currentSlide - 1].querySelector('h1').textContent;
        announcement.textContent = `Now showing slide ${this.currentSlide} of ${this.totalSlides}: ${slideTitle}`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 2000);
    }
    
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide,
            total: this.totalSlides,
            title: this.slides[this.currentSlide - 1].querySelector('h1').textContent,
            isFirst: this.currentSlide === 1,
            isLast: this.currentSlide === this.totalSlides
        };
    }
}

// Global variables
let presentation = null;

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing presentation...');
    
    // Small delay to ensure all elements are ready
    setTimeout(() => {
        try {
            presentation = new PresentationApp();
            
            // Make presentation globally available
            window.presentation = presentation;
            
            console.log('✅ Presentation initialized successfully');
            
            // Log verification of critical elements
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const slideCounter = document.getElementById('slideCounter');
            const slides = document.querySelectorAll('.slide');
            
            console.log('✅ Element verification:');
            console.log('  - Slides found:', slides.length);
            console.log('  - Previous button:', !!prevBtn);
            console.log('  - Next button:', !!nextBtn);
            console.log('  - Slide counter:', !!slideCounter);
            
            // Test button functionality
            if (prevBtn && nextBtn) {
                console.log('✅ Buttons are accessible and ready');
                
                // Add fallback direct event handlers as extra safety
                prevBtn.onclick = function(e) {
                    console.log('Fallback: Previous button direct onclick');
                    e.preventDefault();
                    if (presentation && !prevBtn.disabled) {
                        presentation.previousSlide();
                    }
                };
                
                nextBtn.onclick = function(e) {
                    console.log('Fallback: Next button direct onclick');
                    e.preventDefault();
                    if (presentation && !nextBtn.disabled) {
                        presentation.nextSlide();
                    }
                };
            }
            
            console.log('Current slide info:', presentation.getCurrentSlideInfo());
            
        } catch (error) {
            console.error('❌ Error initializing presentation:', error);
        }
    }, 200);
});

// Additional safety measures
window.addEventListener('load', () => {
    console.log('Window fully loaded');
    
    if (!presentation) {
        console.warn('⚠️  Presentation not initialized, trying again...');
        setTimeout(() => {
            if (!presentation) {
                presentation = new PresentationApp();
                window.presentation = presentation;
            }
        }, 500);
    }
});

// Debug functions (available in browser console)
window.debugPresentation = function() {
    console.log('=== PRESENTATION DEBUG INFO ===');
    console.log('Presentation object:', presentation);
    console.log('Current slide:', presentation ? presentation.currentSlide : 'N/A');
    console.log('Total slides:', presentation ? presentation.totalSlides : 'N/A');
    console.log('Prev button element:', document.getElementById('prevBtn'));
    console.log('Next button element:', document.getElementById('nextBtn'));
    console.log('Active slide:', document.querySelector('.slide.active'));
    console.log('All slides:', document.querySelectorAll('.slide'));
};

window.testNavigation = function() {
    console.log('=== TESTING NAVIGATION ===');
    if (presentation) {
        console.log('Testing next slide...');
        presentation.nextSlide();
        setTimeout(() => {
            console.log('Testing previous slide...');
            presentation.previousSlide();
        }, 1000);
    } else {
        console.log('❌ Presentation not available');
    }
};

// Global error handling
window.addEventListener('error', (e) => {
    console.error('❌ Application error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Unhandled promise rejection:', e.reason);
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresentationApp;
}