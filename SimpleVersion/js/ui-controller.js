/**
 * UI Controller
 * Manages UI interactions, animations, and transitions
 */

const UIController = (function() {
    // Current active step
    let currentStep = 1;
    let isDarkTheme = false;
    
    // DOM Elements
    const elements = {
        // Steps navigation
        stepContents: document.querySelectorAll('.step-content'),
        prevButtons: document.querySelectorAll('.prev-btn'),
        nextButtons: document.querySelectorAll('.next-btn'),
        
        // Theme toggle
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.querySelector('#theme-toggle i'),
        
        // Step 1
        productCardGroup: document.getElementById('product-card-group'),
        next1Button: document.getElementById('next-1'),
        
        // Step 2
        personaCardGroup: document.getElementById('persona-card-group'),
        personaImage: document.getElementById('persona-image'),
        prev2Button: document.getElementById('prev-2'),
        next2Button: document.getElementById('next-2'),
        
        // Step 3
        smalltalkButtonGroup: document.getElementById('smalltalk-button-group'),
        levelButtonGroup: document.getElementById('level-button-group'),
        prev3Button: document.getElementById('prev-3'),
        next3Button: document.getElementById('next-3'),
        
        // Step 4
        productSelection: document.getElementById('product-selection'),
        personaSelection: document.getElementById('persona-selection'),
        smalltalkSelection: document.getElementById('smalltalk-selection'),
        componentOrder: document.getElementById('component-order'),
        componentItems: document.querySelectorAll('#component-order li'),
        prev4Button: document.getElementById('prev-4'),
        generateButton: document.getElementById('generate-btn'),
        
        // Result page
        resultPage: document.getElementById('result-page'),
        promptResult: document.getElementById('prompt-result'),
        copyButton: document.getElementById('copy-btn'),
        saveButton: document.getElementById('save-btn'),
        backToEditButton: document.getElementById('back-to-edit'),
        startOverButton: document.getElementById('start-over'),
        
        // History page
        historyPage: document.getElementById('history-page'),
        historyButton: document.getElementById('history-btn'),
        historyList: document.getElementById('history-list'),
        noHistory: document.getElementById('no-history'),
        backFromHistoryButton: document.getElementById('back-from-history'),
        
        // Toast
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toast-message')
    };
    
    /**
     * Initialize UI event listeners
     */
    function initEventListeners() {
        // Theme toggle
        elements.themeToggle.addEventListener('click', toggleTheme);
        
        // Step navigation
        elements.next1Button.addEventListener('click', () => goToStep(2));
        elements.prev2Button.addEventListener('click', () => goToStep(1));
        elements.next2Button.addEventListener('click', () => goToStep(3));
        elements.prev3Button.addEventListener('click', () => goToStep(2));
        elements.next3Button.addEventListener('click', () => goToStep(4));
        elements.prev4Button.addEventListener('click', () => goToStep(3));
        
        // History button
        elements.historyButton.addEventListener('click', showHistoryPage);
        elements.backFromHistoryButton.addEventListener('click', hideHistoryPage);
        
        // Result page buttons
        elements.backToEditButton.addEventListener('click', hideResultPage);
        elements.startOverButton.addEventListener('click', resetWizard);
        
        // Initialize drag and drop for step 4
        initDragAndDrop();
    }
    
    /**
     * Initialize drag and drop functionality for reordering components
     */
    function initDragAndDrop() {
        const items = elements.componentItems;
        
        items.forEach(item => {
            item.setAttribute('draggable', true);
            
            item.addEventListener('dragstart', () => {
                setTimeout(() => item.classList.add('dragging'), 0);
            });
            
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
        });
        
        elements.componentOrder.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(elements.componentOrder, e.clientY);
            const draggable = document.querySelector('.dragging');
            
            if (afterElement == null) {
                elements.componentOrder.appendChild(draggable);
            } else {
                elements.componentOrder.insertBefore(draggable, afterElement);
            }
            
            // Update numbers in spans
            updateOrderNumbers();
        });
    }
    
    /**
     * Helper function for drag and drop to determine where to place the dragged element
     */
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    /**
     * Update the number prefixes in the order list
     */
    function updateOrderNumbers() {
        const items = elements.componentOrder.querySelectorAll('li');
        items.forEach((item, index) => {
            const span = item.querySelector('span');
            const text = span.textContent;
            span.textContent = `${index + 1}. ${text.substring(text.indexOf('.') + 2)}`;
        });
    }
    
    /**
     * Update the navigation buttons based on the current step
     * @param {number} step - The current step number
     */
    function updateNavigationButtons(step) {
        // Hide all navigation buttons first
        elements.prevButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('hidden');
        });
        elements.nextButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('hidden');
        });
        
        // Show the appropriate buttons based on the current step
        if (step === 1) {
            // Step 1 only shows Next button
            document.getElementById('next-1').classList.add('active');
            document.getElementById('next-1').classList.remove('hidden');
        } else if (step === 2) {
            // Step 2 shows both Previous and Next
            document.getElementById('prev-2').classList.add('active');
            document.getElementById('prev-2').classList.remove('hidden');
            document.getElementById('next-2').classList.add('active');
            document.getElementById('next-2').classList.remove('hidden');
        } else if (step === 3) {
            // Step 3 shows both Previous and Next
            document.getElementById('prev-3').classList.add('active');
            document.getElementById('prev-3').classList.remove('hidden');
            document.getElementById('next-3').classList.add('active');
            document.getElementById('next-3').classList.remove('hidden');
        } else if (step === 4) {
            // Step 4 shows Previous and Generate
            document.getElementById('prev-4').classList.add('active');
            document.getElementById('prev-4').classList.remove('hidden');
            document.getElementById('generate-btn').classList.add('active');
            document.getElementById('generate-btn').classList.remove('hidden');
        }
        
        // Enable the Next button when a selection is made
        if (step === 1 && document.querySelector('#product-card-group .card-option.selected') !== null) {
            elements.next1Button.disabled = false;
        }
    }

    /**
     * Update the step indicators based on the current step
     * @param {number} step - The current step number
     */
    function updateStepIndicators(step) {
        // For each step, get its indicators
        for (let i = 1; i <= 4; i++) {
            const stepIndicators = document.querySelector(`#step-${i} .step-indicator`).querySelectorAll('.step-indicator-item');
            
            // Update each indicator's status
            stepIndicators.forEach((indicator, index) => {
                // Remove all classes first
                indicator.classList.remove('active', 'inactive', 'completed');
                
                if (index + 1 < i) {
                    // Previous steps are completed
                    indicator.classList.add('completed');
                } else if (index + 1 === i) {
                    // Current step is active
                    indicator.classList.add('active');
                } else {
                    // Future steps are inactive
                    indicator.classList.add('inactive');
                }
            });
        }
    }

    /**
     * Navigate to a specific step
     * @param {number} step - The step number to navigate to
     */
    function goToStep(step) {
        // Validate step
        if (step < 1 || step > 4) return;
        
        // Hide all step contents
        elements.stepContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Show the selected step
        document.getElementById(`step-${step}`).classList.add('active');
        
        // Update navigation buttons
        updateNavigationButtons(step);
        
        // Update step indicators
        updateStepIndicators(step);
        
        // Animate the transition
        anime({
            targets: `#step-${step}`,
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 300
        });
        
        // Update current step
        currentStep = step;
    }
    
    /**
     * Show the result page with the generated prompt
     * @param {string} promptContent - The generated prompt content
     */
    function showResultPage(promptContent) {
        // Hide all step contents
        elements.stepContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Set the prompt content
        elements.promptResult.textContent = promptContent;
        
        // Show the result page
        elements.resultPage.classList.add('active');
        
        // Hide navigation buttons when showing result page
        elements.prevButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        elements.nextButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Animate the transition
        anime({
            targets: '#result-page',
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 300
        });
    }
    
    /**
     * Hide the result page and return to editing
     */
    function hideResultPage() {
        // Hide the result page
        elements.resultPage.classList.remove('active');
        
        // Show the last step
        document.getElementById(`step-${currentStep}`).classList.add('active');
        
        // Update navigation buttons
        updateNavigationButtons(currentStep);
    }
    
    /**
     * Show the history page with saved prompts
     */
    function showHistoryPage() {
        // Hide navigation buttons when showing history page
        elements.prevButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        elements.nextButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Get saved prompts from localStorage
        const savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
        
        // Clear current list
        elements.historyList.innerHTML = '';
        
        // Show or hide the "no history" message
        if (savedPrompts.length === 0) {
            elements.noHistory.style.display = 'block';
            elements.historyList.style.display = 'none';
        } else {
            elements.noHistory.style.display = 'none';
            elements.historyList.style.display = 'block';
            
            // Populate the list
            savedPrompts.forEach((prompt, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 cursor-pointer';
                if (isDarkTheme) {
                    listItem.className = 'p-3 bg-gray-700 border rounded-lg hover:bg-gray-600 cursor-pointer';
                }
                
                const date = new Date(prompt.timestamp);
                const formattedDate = date.toLocaleString();
                
                listItem.innerHTML = `
                    <div class="font-medium mb-1">${prompt.title}</div>
                    <div class="text-sm text-gray-500">${formattedDate}</div>
                `;
                
                listItem.addEventListener('click', () => {
                    showResultPage(prompt.content);
                    hideHistoryPage();
                });
                
                elements.historyList.appendChild(listItem);
            });
        }
        
        // Remember the current state
        const previouslyActiveStep = document.querySelector('.step-content.active');
        elements.historyPage.dataset.previousStep = previouslyActiveStep.id;
        
        // Hide all step contents
        elements.stepContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Show the history page
        elements.historyPage.classList.add('active');
        
        // Animate the transition
        anime({
            targets: '#history-page',
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 300
        });
    }
    
    /**
     * Hide the history page and return to the previous state
     */
    function hideHistoryPage() {
        // Hide the history page
        elements.historyPage.classList.remove('active');
        
        // Return to the previous state
        const previousStepId = elements.historyPage.dataset.previousStep || `step-${currentStep}`;
        
        if (previousStepId === 'result-page') {
            // Return to the result page
            elements.resultPage.classList.add('active');
            // Keep navigation buttons hidden
        } else {
            // Return to a wizard step
            document.getElementById(previousStepId).classList.add('active');
            
            // If returning to a step, update the navigation buttons
            if (previousStepId.startsWith('step-')) {
                const stepNum = parseInt(previousStepId.replace('step-', ''));
                updateNavigationButtons(stepNum);
            }
        }
    }
    
    /**
     * Reset the wizard to the initial state
     */
    function resetWizard() {
        // Reset card and button selections
        document.querySelectorAll('.card-option').forEach(c => {
            c.classList.remove('selected');
        });
        document.querySelectorAll('.button-option').forEach(b => {
            b.classList.remove('selected');
        });
        
        // Uncheck all radio inputs
        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = false;
        });
        
        // Reset persona image
        if (elements.personaImage) {
            elements.personaImage.innerHTML = `
                <div class="w-full h-full flex items-center justify-center text-gray-400">
                    <i class="lni lni-user text-6xl"></i>
                </div>
            `;
        }
        
        // Reset selection displays
        document.querySelector('#product-selection .font-medium').textContent = 'None selected';
        document.querySelector('#persona-selection .font-medium').textContent = 'None selected';
        document.querySelector('#smalltalk-selection .font-medium').textContent = 'None selected';
        document.querySelector('#level-selection .font-medium').textContent = 'None selected';
        
        // Reset global variables
        window.selectedLevel = null;
        
        // Reset component order
        elements.componentOrder.innerHTML = `
            <li class="p-3 bg-gray-50 border rounded-lg cursor-move flex items-center" data-id="product">
                <i class="lni lni-menu mr-2 text-gray-500"></i>
                <span>1. Product Information</span>
            </li>
            <li class="p-3 bg-gray-50 border rounded-lg cursor-move flex items-center" data-id="persona">
                <i class="lni lni-menu mr-2 text-gray-500"></i>
                <span>2. Persona</span>
            </li>
            <li class="p-3 bg-gray-50 border rounded-lg cursor-move flex items-center" data-id="smalltalk">
                <i class="lni lni-menu mr-2 text-gray-500"></i>
                <span>3. Small Talk</span>
            </li>
        `;
        
        // Reinitialize drag and drop
        initDragAndDrop();
        
        // Disable next buttons
        elements.next1Button.disabled = true;
        elements.next2Button.disabled = true;
        elements.next3Button.disabled = true;
        
        // Go to step 1
        goToStep(1);
    }
    
    /**
     * Toggle between light and dark theme
     */
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
            elements.themeIcon.className = 'lni lni-moon text-white';
            
            // No longer need to update navigation bar
            
            // Update component order items for dark theme
            elements.componentOrder.querySelectorAll('li').forEach(item => {
                item.classList.remove('bg-white');
                item.classList.add('bg-gray-700');
            });
            
            // Update button options for dark theme
            document.querySelectorAll('.button-option').forEach(option => {
                option.classList.remove('bg-white');
                option.classList.add('bg-gray-700');
            });
            
            // Update selections background
            document.querySelectorAll('.bg-gray-50').forEach(el => {
                el.classList.remove('bg-gray-50');
                el.classList.add('bg-gray-800');
            });
            
            // Update text colors
            document.querySelectorAll('.text-gray-700').forEach(el => {
                el.classList.remove('text-gray-700');
                el.classList.add('text-gray-300');
            });
        } else {
            document.body.classList.remove('dark-theme');
            elements.themeIcon.className = 'lni lni-sun text-aia-gray';
            
            // No longer need to update navigation bar
            
            // Update component order items for light theme
            elements.componentOrder.querySelectorAll('li').forEach(item => {
                item.classList.remove('bg-gray-700');
                item.classList.add('bg-white');
            });
            
            // Update button options for light theme
            document.querySelectorAll('.button-option').forEach(option => {
                option.classList.remove('bg-gray-700');
                option.classList.add('bg-white');
            });
            
            // Update selections background
            document.querySelectorAll('.bg-gray-800').forEach(el => {
                el.classList.remove('bg-gray-800');
                el.classList.add('bg-gray-50');
            });
            
            // Update text colors
            document.querySelectorAll('.text-gray-300').forEach(el => {
                el.classList.remove('text-gray-300');
                el.classList.add('text-gray-700');
            });
        }
        
        // Save preference
        localStorage.setItem('darkTheme', isDarkTheme);
    }
    
    /**
     * Show a toast notification
     * @param {string} message - The message to display
     */
    function showToast(message) {
        elements.toastMessage.textContent = message;
        elements.toast.classList.add('toast-visible');
        elements.toast.classList.remove('toast-hidden');
        
        setTimeout(() => {
            elements.toast.classList.remove('toast-visible');
            elements.toast.classList.add('toast-hidden');
        }, 3000);
    }
    
    /**
     * Initialize the UI
     */
    function init() {
        // Load theme preference
        isDarkTheme = localStorage.getItem('darkTheme') === 'true';
        if (isDarkTheme) {
            toggleTheme();
        }
        
        // Set up event listeners
        initEventListeners();
        
        // Start at step 1
        goToStep(1);
        
        // Set up initial navigation buttons
        updateNavigationButtons(1);
        
        // Set up initial step indicators
        updateStepIndicators(1);
    }
    
    // Public API
    return {
        init,
        goToStep,
        showResultPage,
        hideResultPage,
        showHistoryPage,
        hideHistoryPage,
        resetWizard,
        showToast,
        getComponentOrder: () => {
            const items = elements.componentOrder.querySelectorAll('li');
            return Array.from(items).map(item => item.dataset.id);
        },
        elements
    };
})();
