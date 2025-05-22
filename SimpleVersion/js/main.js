/**
 * Main Application
 * Initializes and connects all components
 */

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
                imageUrl: "img/placeholder-health-plus.jpg"
            },
            {
                id: "product2", // Changed to match the file names in PromptData
                name: "Personal Accident",
                shortDescription: "Accident Insurance covering medical expenses with cashless hospital benefits",
                imageUrl: "img/placeholder-accident.jpg"
            },
            {
                id: "product3", // Changed to match the file names in PromptData
                name: "Infinite Care",
                shortDescription: "Premium health insurance with worldwide coverage and comprehensive treatment",
                imageUrl: "img/placeholder-secure-life.jpg"
            },
            {
                id: "product4", // Changed to match the file names in PromptData
                name: "CI SuperCare",
                shortDescription: "Critical Illness Cover for early-stage and severe diseases, including major causes of death",
                imageUrl: "img/placeholder-retirement.jpg"
            }
        ];
        
        // Products card group
        const productCardGroup = document.getElementById('product-card-group');
        
        aiaProducts.forEach(product => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card-option flex flex-col border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer';
            cardDiv.dataset.value = product.id;
            cardDiv.dataset.type = 'product';
            
            cardDiv.innerHTML = `
                <input type="radio" id="product-${product.id}" name="product" class="hidden" value="${product.id}">
                <div class="card-image" style="background-image: url('${product.imageUrl}');">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${product.name}</h3>
                    <p class="card-description">${product.shortDescription}</p>
                </div>
            `;
            
            // Let the card height be determined by its content
            // No fixed height to ensure text is fully visible
            
            productCardGroup.appendChild(cardDiv);
        });
        
        // Personas card group
        const personas = PromptData.getPersonasList();
        const personaCardGroup = document.getElementById('persona-card-group');
        
        // Define persona details with icons
        const personaDetails = {
            'educational': { 
                icon: 'lni lni-graduation',
                description: 'Informative and educational approach focused on explaining complex concepts clearly.'
            },
            'empathetic': { 
                icon: 'lni lni-heart',
                description: 'Compassionate and understanding approach that connects on an emotional level.'
            },
            'friendly': { 
                icon: 'lni lni-smile',
                description: 'Warm and approachable communication style that builds rapport quickly.'
            },
            'professional': { 
                icon: 'lni lni-briefcase',
                description: 'Formal and businesslike approach that emphasizes expertise and authority.'
            }
        };
        
        personas.forEach(persona => {
            const formattedName = persona.replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
            
            const details = personaDetails[persona] || { 
                icon: 'lni lni-user', 
                description: 'A communication style for engaging with customers.'
            };
            
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card-option shadow-md';
            cardDiv.dataset.value = persona;
            cardDiv.dataset.type = 'persona';
            
            cardDiv.innerHTML = `
                <input type="radio" id="persona-${persona}" name="persona" class="hidden" value="${persona}">
                <div class="card-content">
                    <div class="flex items-center mb-2">
                        <i class="${details.icon} text-aia-red text-2xl mr-2"></i>
                        <h3 class="card-title">${formattedName}</h3>
                    </div>
                    <p class="card-description">${details.description}</p>
                </div>
            `;
            
            personaCardGroup.appendChild(cardDiv);
        });
        
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
     * Sets up event listeners for user interactions
     */
    function setupEventListeners() {
        // Product card clicks
        document.querySelectorAll('#product-card-group .card-option').forEach(card => {
            card.addEventListener('click', async function() {
                // Remove selected class from all cards in the group
                document.querySelectorAll('#product-card-group .card-option').forEach(c => {
                    c.classList.remove('selected');
                });
                
                // Add selected class to clicked card
                this.classList.add('selected');
                
                // Select the actual radio input
                const radioInput = this.querySelector('input[type="radio"]');
                radioInput.checked = true;
                
                const productId = this.dataset.value;
                
                // Load product content
                const content = await PromptGenerator.setProduct(productId);
                
                // Get the product name from the card
                const productName = this.querySelector('.card-title').textContent;
                
                // Update the product selection display
                document.querySelector('#product-selection .font-medium').textContent = productName;
                
                // Next button is already enabled
            });
        });
        
        // Persona card clicks
        document.querySelectorAll('#persona-card-group .card-option').forEach(card => {
            card.addEventListener('click', async function() {
                // Remove selected class from all cards in the group
                document.querySelectorAll('#persona-card-group .card-option').forEach(c => {
                    c.classList.remove('selected');
                });
                
                // Add selected class to clicked card
                this.classList.add('selected');
                
                // Select the actual radio input
                const radioInput = this.querySelector('input[type="radio"]');
                radioInput.checked = true;
                
                const personaId = this.dataset.value;
                
                // Load persona content
                const content = await PromptGenerator.setPersona(personaId);
                
                // Get the persona name from the card
                const personaName = this.querySelector('.card-title').textContent;
                
                // Update the persona selection display
                document.querySelector('#persona-selection .font-medium').textContent = personaName;
                
                // Update the persona image based on selection
                const personaImage = document.getElementById('persona-image');
                const icons = {
                    'educational': 'lni lni-graduation',
                    'empathetic': 'lni lni-heart',
                    'friendly': 'lni lni-smile',
                    'professional': 'lni lni-briefcase'
                };
                
                personaImage.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-70">
                        <i class="${icons[personaId] || 'lni lni-user'} text-white text-6xl"></i>
                    </div>
                `;
                
                // Enable the next button
                UIController.elements.next2Button.disabled = false;
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
                const content = await PromptGenerator.setSmalltalk(smalltalkId);
                
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
                PromptGenerator.setLevel(levelId);
                
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
            UIController.elements.next3Button.disabled = !(smalltalkSelected && levelSelected);
        }
        
        // Generate button click
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
                UIController.showToast('Error generating prompt: ' + error.message);
            }
        });
        
        // Copy button click
        UIController.elements.copyButton.addEventListener('click', async function() {
            const content = UIController.elements.promptResult.textContent;
            const success = await PromptGenerator.copyToClipboard(content);
            
            if (success) {
                UIController.showToast('Prompt copied to clipboard');
            } else {
                UIController.showToast('Failed to copy to clipboard');
            }
        });
        
        // Save button click
        UIController.elements.saveButton.addEventListener('click', function() {
            const content = UIController.elements.promptResult.textContent;
            PromptGenerator.savePrompt(content);
            UIController.showToast('Prompt saved successfully');
        });
    }
})();
