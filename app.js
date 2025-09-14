// Application state
let currentSlide = 0;
const totalSlides = 7;
let catalystActive = false;
let temperatureActive = false;
let activationActive = false;

// Point information data for original reaction
const pointData = {
    'A': {
        title: 'Reactants: CH₃Br + Nu⁻',
        content: 'Starting materials at ground state energy. Nucleophile approaches the methyl bromide molecule.',
        energy: 0
    },
    'D': {
        title: 'Energy Barrier',
        content: 'Initial energy increase as nucleophile begins to approach. Van der Waals interactions start to form.',
        energy: 15
    },
    'C': {
        title: 'Transition State',
        content: 'Highest energy point where C-Br bond is breaking and C-Nu bond is forming simultaneously. Critical point for reaction rate.',
        energy: 40
    },
    'E': {
        title: 'Product Formation',
        content: 'Products are forming but still at elevated energy. C-Nu bond is strengthening while Br⁻ is departing.',
        energy: 10
    },
    'B': {
        title: 'Products: CH₃Nu + Br⁻',
        content: 'Final products at lower energy than reactants. Reaction is thermodynamically favorable (exergonic).',
        energy: -5
    }
};

// Point information data for THCA reaction
const thcaPointData = {
    'THCA': {
        title: 'THCA (Reactant)',
        content: 'Tetrahydrocannabinolic acid - non-psychoactive precursor compound at ground state energy.',
        energy: 0
    },
    'TS': {
        title: 'Transition State',
        content: 'Highest energy point where carboxyl group (-COOH) is being eliminated as CO₂. Ea = 25-30 kcal/mol.',
        energy: 28
    },
    'THC': {
        title: 'THC + CO₂ (Products)',
        content: 'Tetrahydrocannabinol (psychoactive) plus carbon dioxide gas. Lower energy than reactant.',
        energy: -8
    }
};

// DOM elements - will be initialized after DOM loads
let slides, navButtons, prevButton, nextButton, slideCounter;
let catalystToggle, temperatureToggle, activationToggle, tooltip, tooltipTitle, tooltipContent;
let reactionPoints, thcaPoints;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    
    // Wait a bit for all elements to be ready
    setTimeout(() => {
        initializeDOM();
        initializeSlideNavigation();
        initializeDiagramInteractions();
        goToSlide(0); // Start with first slide
        console.log('Application fully initialized');
    }, 100);
});

function initializeDOM() {
    slides = document.querySelectorAll('.slide');
    navButtons = document.querySelectorAll('.nav-btn');
    prevButton = document.getElementById('prev-slide');
    nextButton = document.getElementById('next-slide');
    slideCounter = document.getElementById('slide-counter');
    catalystToggle = document.getElementById('catalyst-toggle');
    temperatureToggle = document.getElementById('temperature-toggle');
    activationToggle = document.getElementById('activation-toggle');
    tooltip = document.getElementById('point-tooltip');
    tooltipTitle = document.getElementById('tooltip-title');
    tooltipContent = document.getElementById('tooltip-content');
    reactionPoints = document.querySelectorAll('.reaction-point');
    thcaPoints = document.querySelectorAll('.thca-point');
    
    console.log('DOM elements initialized:', {
        slides: slides ? slides.length : 0,
        navButtons: navButtons ? navButtons.length : 0,
        reactionPoints: reactionPoints ? reactionPoints.length : 0,
        thcaPoints: thcaPoints ? thcaPoints.length : 0,
        prevButton: !!prevButton,
        nextButton: !!nextButton,
        catalystToggle: !!catalystToggle,
        temperatureToggle: !!temperatureToggle,
        activationToggle: !!activationToggle,
        tooltip: !!tooltip
    });
}

// Slide navigation functions
function initializeSlideNavigation() {
    console.log('Initializing slide navigation...');
    
    // Top navigation buttons
    if (navButtons && navButtons.length > 0) {
        navButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Nav button clicked for slide:', index);
                goToSlide(index);
            });
        });
        console.log('Top navigation initialized for', navButtons.length, 'buttons');
    }

    // Previous/Next arrows
    if (prevButton) {
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Previous button clicked, current slide:', currentSlide);
            if (currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        });
        console.log('Previous button initialized');
    }

    if (nextButton) {
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Next button clicked, current slide:', currentSlide);
            if (currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
            }
        });
        console.log('Next button initialized');
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return; // Don't interfere with form inputs
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                if (currentSlide > 0) {
                    e.preventDefault();
                    goToSlide(currentSlide - 1);
                }
                break;
            case 'ArrowRight':
                if (currentSlide < totalSlides - 1) {
                    e.preventDefault();
                    goToSlide(currentSlide + 1);
                }
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
                e.preventDefault();
                const slideNum = parseInt(e.key) - 1;
                if (slideNum >= 0 && slideNum < totalSlides) {
                    goToSlide(slideNum);
                }
                break;
        }
    });
    
    console.log('Keyboard navigation initialized');
}

function goToSlide(slideIndex) {
    console.log('goToSlide called:', slideIndex, 'from current:', currentSlide);
    
    if (slideIndex < 0 || slideIndex >= totalSlides) {
        console.log('Invalid slide index:', slideIndex);
        return;
    }
    
    if (slideIndex === currentSlide) {
        console.log('Same slide, no change needed');
        return;
    }

    // Hide tooltip first
    hideTooltip();

    // Hide all slides
    if (slides && slides.length > 0) {
        slides.forEach((slide, index) => {
            if (slide) {
                slide.classList.remove('active');
                slide.style.display = 'none';
            }
        });
    }

    // Remove active class from all nav buttons
    if (navButtons && navButtons.length > 0) {
        navButtons.forEach(button => {
            if (button) {
                button.classList.remove('active');
            }
        });
    }

    // Update current slide
    const previousSlide = currentSlide;
    currentSlide = slideIndex;
    
    // Show the target slide
    if (slides && slides[currentSlide]) {
        const targetSlide = slides[currentSlide];
        targetSlide.style.display = 'block';
        targetSlide.classList.add('active');
        console.log('Activated slide:', currentSlide);
    }

    // Update nav button
    if (navButtons && navButtons[currentSlide]) {
        navButtons[currentSlide].classList.add('active');
    }

    // Reset diagram states when changing slides
    if (previousSlide !== currentSlide) {
        resetDiagramStates();
    }

    // Update navigation state
    updateNavigationState();
    
    console.log('Successfully changed to slide:', currentSlide);
}

function updateNavigationState() {
    // Update Previous/Next buttons
    if (prevButton) {
        prevButton.disabled = currentSlide === 0;
    }
    if (nextButton) {
        nextButton.disabled = currentSlide === totalSlides - 1;
    }
    
    // Update slide counter
    if (slideCounter) {
        slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }
    
    console.log('Navigation state updated - slide:', currentSlide + 1, '/', totalSlides);
}

// Diagram interaction functions
function initializeDiagramInteractions() {
    console.log('Initializing diagram interactions...');
    
    // Catalyst toggle
    if (catalystToggle) {
        catalystToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCatalyst();
        });
        console.log('Catalyst toggle initialized');
    }

    // Temperature toggle
    if (temperatureToggle) {
        temperatureToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleTemperature();
        });
        console.log('Temperature toggle initialized');
    }

    // Activation energy toggle
    if (activationToggle) {
        activationToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleActivationEnergy();
        });
        console.log('Activation energy toggle initialized');
    }

    // Original reaction point hover interactions
    if (reactionPoints && reactionPoints.length > 0) {
        reactionPoints.forEach((point, index) => {
            if (point) {
                // Mouse events for tooltip
                point.addEventListener('mouseenter', handlePointHover);
                point.addEventListener('mouseleave', handlePointLeave);
                point.addEventListener('mousemove', updateTooltipPosition);
                
                // Make points focusable for accessibility
                point.setAttribute('tabindex', '0');
                
                // Keyboard events for accessibility
                point.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handlePointHover(e);
                    }
                });
                point.addEventListener('blur', handlePointLeave);
                
                console.log('Initialized interactions for reaction point:', index);
            }
        });
        console.log('Original reaction point interactions initialized for', reactionPoints.length, 'points');
    }

    // THCA reaction point hover interactions
    if (thcaPoints && thcaPoints.length > 0) {
        thcaPoints.forEach((point, index) => {
            if (point) {
                // Mouse events for tooltip
                point.addEventListener('mouseenter', handleThcaPointHover);
                point.addEventListener('mouseleave', handlePointLeave);
                point.addEventListener('mousemove', updateTooltipPosition);
                
                // Make points focusable for accessibility
                point.setAttribute('tabindex', '0');
                
                // Keyboard events for accessibility
                point.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleThcaPointHover(e);
                    }
                });
                point.addEventListener('blur', handlePointLeave);
                
                console.log('Initialized interactions for THCA point:', index);
            }
        });
        console.log('THCA point interactions initialized for', thcaPoints.length, 'points');
    }

    // Hide tooltip when clicking outside diagrams
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#reaction-diagram') && 
            !e.target.closest('#thca-diagram') && 
            !e.target.closest('#point-tooltip')) {
            hideTooltip();
        }
    });
}

function toggleCatalyst() {
    console.log('Toggling catalyst, current state:', catalystActive);
    
    catalystActive = !catalystActive;
    const catalyzedPath = document.getElementById('catalyzed-pathway');
    
    if (catalyzedPath && catalystToggle) {
        if (catalystActive) {
            catalyzedPath.style.opacity = '1';
            catalystToggle.textContent = 'Hide Catalyst Effect (Line a)';
            catalystToggle.classList.add('active');
            console.log('Catalyst effect shown');
        } else {
            catalyzedPath.style.opacity = '0';
            catalystToggle.textContent = 'Show Catalyst Effect (Line a)';
            catalystToggle.classList.remove('active');
            console.log('Catalyst effect hidden');
        }
    } else {
        console.log('Catalyst elements not found:', { catalyzedPath: !!catalyzedPath, catalystToggle: !!catalystToggle });
    }
}

function toggleTemperature() {
    console.log('Toggling temperature, current state:', temperatureActive);
    
    temperatureActive = !temperatureActive;
    const temperaturePath = document.getElementById('temperature-pathway');
    
    if (temperaturePath && temperatureToggle) {
        if (temperatureActive) {
            temperaturePath.style.opacity = '1';
            temperatureToggle.textContent = 'Hide Temperature Effect (Line b)';
            temperatureToggle.classList.add('active');
            console.log('Temperature effect shown');
        } else {
            temperaturePath.style.opacity = '0';
            temperatureToggle.textContent = 'Show Temperature Effect (Line b)';
            temperatureToggle.classList.remove('active');
            console.log('Temperature effect hidden');
        }
    } else {
        console.log('Temperature elements not found:', { temperaturePath: !!temperaturePath, temperatureToggle: !!temperatureToggle });
    }
}

function toggleActivationEnergy() {
    console.log('Toggling activation energy, current state:', activationActive);
    
    activationActive = !activationActive;
    const eaLine = document.getElementById('ea-line');
    const eaText = document.getElementById('ea-text');
    
    if (eaLine && eaText && activationToggle) {
        if (activationActive) {
            eaLine.style.opacity = '1';
            eaText.style.opacity = '1';
            activationToggle.innerHTML = 'Hide E<sub>a</sub>';
            activationToggle.classList.add('active');
            console.log('Activation energy annotation shown');
        } else {
            eaLine.style.opacity = '0';
            eaText.style.opacity = '0';
            activationToggle.innerHTML = 'Show E<sub>a</sub>';
            activationToggle.classList.remove('active');
            console.log('Activation energy annotation hidden');
        }
    } else {
        console.log('Activation energy elements not found:', { eaLine: !!eaLine, eaText: !!eaText, activationToggle: !!activationToggle });
    }
}

function handlePointHover(event) {
    const point = event.target;
    const pointLetter = point.getAttribute('data-point') || point.id.split('-')[1]?.toUpperCase();
    
    console.log('Point hovered:', pointLetter, point);
    
    const data = pointData[pointLetter];
    
    if (data && tooltip) {
        showTooltip(data.title, data.content, event);
    } else {
        console.log('No data found for point:', pointLetter, 'Available data:', Object.keys(pointData));
    }
}

function handleThcaPointHover(event) {
    const point = event.target;
    const pointKey = point.getAttribute('data-point');
    
    console.log('THCA point hovered:', pointKey, point);
    
    const data = thcaPointData[pointKey];
    
    if (data && tooltip) {
        showTooltip(data.title, data.content, event);
    } else {
        console.log('No data found for THCA point:', pointKey, 'Available data:', Object.keys(thcaPointData));
    }
}

function handlePointLeave(event) {
    console.log('Point leave triggered');
    hideTooltip();
}

function showTooltip(title, content, event) {
    if (!tooltip || !tooltipTitle || !tooltipContent) {
        console.log('Tooltip elements not found:', { tooltip: !!tooltip, tooltipTitle: !!tooltipTitle, tooltipContent: !!tooltipContent });
        return;
    }
    
    console.log('Showing tooltip:', title);
    
    tooltipTitle.innerHTML = title; // Use innerHTML to support HTML entities and subscripts
    tooltipContent.textContent = content;
    
    // Make tooltip visible
    tooltip.classList.remove('hidden');
    tooltip.style.display = 'block';
    tooltip.style.opacity = '1';
    tooltip.style.pointerEvents = 'none';
    
    updateTooltipPosition(event);
}

function updateTooltipPosition(event) {
    if (!tooltip || tooltip.classList.contains('hidden')) return;
    
    const x = event.clientX;
    const y = event.clientY;
    
    // Position tooltip relative to cursor
    let left = x + 15;
    let top = y - 15;
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get tooltip dimensions (approximate)
    const tooltipWidth = 250; // max-width from CSS
    const tooltipHeight = 100; // approximate height
    
    // Adjust position to keep tooltip on screen
    if (left + tooltipWidth > viewportWidth) {
        left = x - tooltipWidth - 15;
    }
    
    if (top - tooltipHeight < 0) {
        top = y + 15;
    }
    
    tooltip.style.position = 'fixed';
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.style.zIndex = '1000';
}

function hideTooltip() {
    if (tooltip) {
        console.log('Hiding tooltip');
        tooltip.classList.add('hidden');
        tooltip.style.opacity = '0';
        setTimeout(() => {
            tooltip.style.display = 'none';
        }, 150); // Match CSS transition duration
    }
}

function resetDiagramStates() {
    console.log('Resetting diagram states');
    
    // Reset all toggle states
    catalystActive = false;
    temperatureActive = false;
    activationActive = false;
    
    // Reset visual states
    const catalyzedPath = document.getElementById('catalyzed-pathway');
    const temperaturePath = document.getElementById('temperature-pathway');
    const eaLine = document.getElementById('ea-line');
    const eaText = document.getElementById('ea-text');
    
    if (catalyzedPath) catalyzedPath.style.opacity = '0';
    if (temperaturePath) temperaturePath.style.opacity = '0';
    if (eaLine) eaLine.style.opacity = '0';
    if (eaText) eaText.style.opacity = '0';
    
    // Reset button states
    if (catalystToggle) {
        catalystToggle.textContent = 'Show Catalyst Effect (Line a)';
        catalystToggle.classList.remove('active');
    }
    if (temperatureToggle) {
        temperatureToggle.textContent = 'Show Temperature Effect (Line b)';
        temperatureToggle.classList.remove('active');
    }
    if (activationToggle) {
        activationToggle.innerHTML = 'Show E<sub>a</sub>';
        activationToggle.classList.remove('active');
    }
}

// Utility functions
function enhanceAccessibility() {
    // Add ARIA labels to interactive elements
    if (navButtons && navButtons.length > 0) {
        const slideNames = ['Title', 'Introduction', 'Original Analysis', 'External Factors', 'Cannabis Applications', 'THCA Reaction Diagram', 'References'];
        navButtons.forEach((button, index) => {
            if (button && slideNames[index]) {
                button.setAttribute('aria-label', `Go to ${slideNames[index]} slide`);
                button.setAttribute('role', 'tab');
            }
        });
    }
    
    if (slides && slides.length > 0) {
        slides.forEach((slide, index) => {
            if (slide) {
                slide.setAttribute('role', 'tabpanel');
                slide.setAttribute('aria-labelledby', `slide-${index + 1}`);
            }
        });
    }
    
    if (tooltip) {
        tooltip.setAttribute('role', 'tooltip');
        tooltip.setAttribute('aria-live', 'polite');
    }
    
    // Add ARIA labels to diagram controls
    if (catalystToggle) {
        catalystToggle.setAttribute('aria-label', 'Toggle catalyst effect visualization');
    }
    if (temperatureToggle) {
        temperatureToggle.setAttribute('aria-label', 'Toggle temperature effect visualization');
    }
    if (activationToggle) {
        activationToggle.setAttribute('aria-label', 'Toggle activation energy annotation');
    }
    
    console.log('Accessibility enhancements applied');
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        enhanceAccessibility();
    }, 500);
});

// Handle window resize for tooltip positioning
window.addEventListener('resize', function() {
    hideTooltip();
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error, e.filename, e.lineno);
});

// Export functions for debugging and testing
window.ChemistryApp = {
    goToSlide: goToSlide,
    toggleCatalyst: toggleCatalyst,
    toggleTemperature: toggleTemperature,
    toggleActivationEnergy: toggleActivationEnergy,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides,
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    resetDiagramStates: resetDiagramStates,
    // Debug functions
    logState: () => console.log('App state:', { currentSlide, catalystActive, temperatureActive, activationActive }),
    testNavigation: () => {
        console.log('Testing navigation...');
        for (let i = 0; i < totalSlides; i++) {
            setTimeout(() => goToSlide(i), i * 1000);
        }
    }
};

console.log('ChemistryApp initialized with', totalSlides, 'slides');
