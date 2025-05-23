/**
 * Main Application
 * Initializes and connects all components
 */

// Global variable to store persona carousel instance
let personaCarousel = null;

// Function to initialize persona carousel
async function initializePersonaCarousel() {
    try {
        const personas = await PersonaDataLoader.loadPersonas();
        personaCarousel = new PersonaCarousel('persona-carousel-container', personas);
        
        // Listen for persona selection from carousel
        document.getElementById('persona-carousel-container').addEventListener('persona-auto-selected', async (e) => {
            const persona = e.detail;
            
            // Map new persona IDs to old ones for compatibility
            const personaMapping = {
                'persona-1': 'friendly',
                'persona-2': 'empathetic',
                'persona-3': 'educational',
                'persona-4': 'professional'
            };
            
            const mappedPersonaId = personaMapping[persona.id] || persona.id;
            
            // Load persona content
            if (typeof PromptGenerator !== 'undefined' && PromptGenerator.setPersona) {
                await PromptGenerator.setPersona(mappedPersonaId);
            }
            
            // Update the persona selection display
            document.querySelector('#persona-selection .font-medium').textContent = persona.name;
            
            // Enable the next button
            if (typeof UIController !== 'undefined' && UIController.elements && UIController.elements.next2Button) {
                UIController.elements.next2Button.disabled = false;
            }
        });
    } catch (error) {
        console.error('Error initializing persona carousel:', error);
    }
}

(async function() {
    // Initialize UI
    UIController.init();
    
    // Load prompt data
    await PromptData.init();
    
    // Populate dropdowns
    populateDropdowns();
    
    // Set up event listeners
    setupEventListeners();
    
    /**
     * Populates the product cards, persona cards, and smalltalk buttons
     */
    function populateDropdowns() {
        // Define AIA Thailand products based on provided information
        const aiaProducts = [
            {
                id: "product1", // Changed to match the file names in PromptData
                name: "Health Happy",
                shortDescription: "Health Insurance with lump-sum benefits up to 25M THB/year, covers OPD and IPD",
                imageUrl: "img/aia_health_happy.jpg"
            },
            {
                id: "product2", // Changed to match the file names in PromptData
                name: "Personal Accident",
                shortDescription: "Accident Insurance covering medical expenses with cashless hospital benefits",
                imageUrl: "img/aia_personal_accident.jpg"
            },
            {
                id: "product3", // Changed to match the file names in PromptData
                name: "Infinite Care",
                shortDescription: "Premium health insurance with worldwide coverage and comprehensive treatment",
                imageUrl: "img/aia_infinite_care.jpg"
            },
            {
                id: "product4", // Changed to match the file names in PromptData
                name: "CI SuperCare",
                shortDescription: "Critical Illness Cover for early-stage and severe diseases, including major causes of death",
                imageUrl: "img/aia_non_par.jpg"
            }
        ];
        
        // Products card group
        const productCardGroup = document.getElementById('product-card-group');
        productCardGroup.className = 'grid grid-cols-2 md:grid-cols-4 gap-4';
        
        aiaProducts.forEach(product => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'cursor-pointer hover:opacity-80 transition-opacity';
            cardDiv.dataset.value = product.id;
            cardDiv.dataset.type = 'product';
            
            cardDiv.innerHTML = `
                <input type="radio" id="product-${product.id}" name="product" class="hidden" value="${product.id}">
                <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow">
            `;
            
            productCardGroup.appendChild(cardDiv);
        });
        
        // Initialize Persona Carousel
        initializePersonaCarousel();
        
        // Small talks button group
        const smalltalks = PromptData.getSmalltalksList();
        const smalltalkButtonGroup = document.getElementById('smalltalk-button-group');
        
        // Define smalltalk details with icons
        const smalltalkDetails = {
            'continuity': { icon: 'lni lni-reload' },
            'motivational': { icon: 'lni lni-star' },
            'seasonal': { icon: 'lni lni-calendar' },
            'tech_fact': { icon: 'lni lni-bulb' }
        };
        
        smalltalks.forEach(smalltalk => {
            const formattedName = smalltalk.replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
                
            const details = smalltalkDetails[smalltalk] || { icon: 'lni lni-bubble' };
            
            const buttonDiv = document.createElement('div');
            buttonDiv.className = 'button-option';
            buttonDiv.dataset.value = smalltalk;
            buttonDiv.dataset.type = 'smalltalk';
            
            buttonDiv.innerHTML = `
                <input type="radio" id="smalltalk-${smalltalk}" name="smalltalk" class="hidden" value="${smalltalk}">
                <i class="${details.icon} text-lg mr-1"></i>
                <span>${formattedName}</span>
            `;
            
            smalltalkButtonGroup.appendChild(buttonDiv);
        });
        
        // Add CSS for radio buttons
        const style = document.createElement('style');
        style.textContent = `
            .radio-option.selected {
                background-color: rgba(237, 27, 47, 0.1);
                border-color: #ed1b2f;
            }
            
            .radio-option.selected .radio-circle {
                border-color: #ed1b2f;
                position: relative;
            }
            
            .radio-option.selected .radio-circle::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 10px;
                height: 10px;
                background-color: #ed1b2f;
                border-radius: 50%;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Helper function to update the product next button state
     */
    function updateProductNextButton(isEnabled) {
        const productNextButton = document.getElementById('product-next');
        if (productNextButton) {
            productNextButton.disabled = !isEnabled;
            if (isEnabled) {
                productNextButton.classList.remove('opacity-50', 'cursor-not-allowed');
                productNextButton.classList.add('hover:bg-red-700');
            } else {
                productNextButton.classList.add('opacity-50', 'cursor-not-allowed');
                productNextButton.classList.remove('hover:bg-red-700');
            }
        }
    }
    
    /**
     * Sets up event listeners for user interactions
     */
    function setupEventListeners() {
        // Initially disable the product next button
        updateProductNextButton(false);
        
        // Product card clicks - NEW BEHAVIOR: Toggle selection and use overlay for unselected
        document.querySelectorAll('#product-card-group > div').forEach(card => {
            card.addEventListener('click', async function() {
                const productId = this.dataset.value;
                const radioInput = this.querySelector('input[type="radio"]');
                const productName = this.querySelector('img').alt;
                
                // Check if this card is already selected
                const isAlreadySelected = this.classList.contains('selected');
                
                if (isAlreadySelected) {
                    // Unselect the product
                    this.classList.remove('selected');
                    radioInput.checked = false;
                    
                    // Remove dimmed class from all cards
                    document.querySelectorAll('#product-card-group > div').forEach(c => {
                        c.classList.remove('dimmed');
                    });
                    
                    // Clear product selection
                    document.querySelector('#product-selection .font-medium').textContent = 'None selected';
                    
                    // Reset prompt generator
                    if (typeof PromptGenerator !== 'undefined' && PromptGenerator.setProduct) {
                        PromptGenerator.setProduct(null);
                    }
                    
                    // Disable the next button when no product is selected
                    updateProductNextButton(false);
                } else {
                    // Remove selected class from all cards in the group
                    document.querySelectorAll('#product-card-group > div').forEach(c => {
                        c.classList.remove('selected');
                        c.querySelector('input[type="radio"]').checked = false;
                    });
                    
                    // Add selected class to clicked card
                    this.classList.add('selected');
                    radioInput.checked = true;
                    
                    // Add dimmed class to all other cards
                    document.querySelectorAll('#product-card-group > div').forEach(c => {
                        if (c !== this) {
                            c.classList.add('dimmed');
                        } else {
                            c.classList.remove('dimmed');
                        }
                    });
                    
                    // Load product content
                    if (typeof PromptGenerator !== 'undefined' && PromptGenerator.setProduct) {
                        const content = await PromptGenerator.setProduct(productId);
                    }
                    
                    // Update the product selection display
                    document.querySelector('#product-selection .font-medium').textContent = productName;
                    
                    // Enable the next button when a product is selected
                    updateProductNextButton(true);
                }
            });
        });
        
        // Small talk button clicks
        document.querySelectorAll('#smalltalk-button-group .button-option').forEach(button => {
            button.addEventListener('click', async function() {
                // Remove selected class from all buttons in the group
                document.querySelectorAll('#smalltalk-button-group .button-option').forEach(b => {
                    b.classList.remove('selected');
                });
                
                // Add selected class to clicked button
                this.classList.add('selected');
                
                // Select the actual radio input
                const radioInput = this.querySelector('input[type="radio"]');
                if (radioInput) radioInput.checked = true;
                
                const smalltalkId = this.dataset.value;
                
                // Load small talk content
                if (typeof PromptGenerator !== 'undefined' && PromptGenerator.setSmalltalk) {
                    const content = await PromptGenerator.setSmalltalk(smalltalkId);
                }
                
                // Get the formatted name from the button text
                const smalltalkName = this.querySelector('span').textContent;
                
                // Update the small talk selection display
                document.querySelector('#smalltalk-selection .font-medium').textContent = smalltalkName;
                
                checkStep3Complete();
            });
        });
        
        // Difficulty level button clicks
        document.querySelectorAll('#level-button-group .button-option').forEach(button => {
            button.addEventListener('click', function() {
                // Remove selected class from all buttons in the group
                document.querySelectorAll('#level-button-group .button-option').forEach(b => {
                    b.classList.remove('selected');
                });
                
                // Add selected class to clicked button
                this.classList.add('selected');
                
                const levelId = this.dataset.value;
                const levelName = this.querySelector('.font-medium').textContent;
                
                // Set the level in the prompt generator
                if (typeof PromptGenerator !== 'undefined' && PromptGenerator.setLevel) {
                    PromptGenerator.setLevel(levelId);
                }
                
                // Update the level selection display
                document.querySelector('#level-selection .font-medium').textContent = levelName;
                
                checkStep3Complete();
            });
        });
        
        // Function to check if step 3 is complete (both smalltalk and level selected)
        function checkStep3Complete() {
            const smalltalkSelected = document.querySelector('#smalltalk-button-group .button-option.selected') !== null;
            const levelSelected = document.querySelector('#level-button-group .button-option.selected') !== null;
            
            // Enable the next button only if both are selected
            if (typeof UIController !== 'undefined' && UIController.elements && UIController.elements.next3Button) {
                UIController.elements.next3Button.disabled = !(smalltalkSelected && levelSelected);
            }
        }
        
        // Generate button click
        if (typeof UIController !== 'undefined' && UIController.elements && UIController.elements.generateButton) {
            UIController.elements.generateButton.addEventListener('click', function() {
                try {
                    // Get the component order
                    const order = UIController.getComponentOrder();
                    
                    // Generate the prompt
                    const promptContent = PromptGenerator.generatePrompt(order);
                    
                    // Show the result page
                    UIController.showResultPage(promptContent);
                } catch (error) {
                    console.error('Error generating prompt:', error);
                    if (typeof UIController !== 'undefined' && UIController.showToast) {
                        UIController.showToast('Error generating prompt: ' + error.message);
                    }
                }
            });
        }
        
        // Copy button click
        if (typeof UIController !== 'undefined' && UIController.elements && UIController.elements.copyButton) {
            UIController.elements.copyButton.addEventListener('click', async function() {
                const content = UIController.elements.promptResult.textContent;
                const success = await PromptGenerator.copyToClipboard(content);
                
                if (success) {
                    UIController.showToast('Prompt copied to clipboard');
                } else {
                    UIController.showToast('Failed to copy to clipboard');
                }
            });
        }
        
        // Save button click
        if (typeof UIController !== 'undefined' && UIController.elements && UIController.elements.saveButton) {
            UIController.elements.saveButton.addEventListener('click', function() {
                const content = UIController.elements.promptResult.textContent;
                if (typeof PromptGenerator !== 'undefined' && PromptGenerator.savePrompt) {
                    PromptGenerator.savePrompt(content);
                }
                if (typeof UIController !== 'undefined' && UIController.showToast) {
                    UIController.showToast('Prompt saved successfully');
                }
            });
        }
    }
})();