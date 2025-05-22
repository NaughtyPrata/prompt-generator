/**
 * Prompt Generator
 * Manages prompt combination and generation logic
 */

const PromptGenerator = (function() {
    // Selected items
    let selectedProduct = '';
    let selectedPersona = '';
    let selectedSmalltalk = '';
    let selectedLevel = '';
    
    // Component contents
    let productContent = '';
    let personaContent = '';
    let smalltalkContent = '';
    let levelContent = '';
    
    /**
     * Sets the selected product
     * @param {string} product - The product ID
     */
    async function setProduct(product) {
        selectedProduct = product;
        productContent = await PromptData.getPrompt('products', product);
        return productContent;
    }
    
    /**
     * Sets the selected persona
     * @param {string} persona - The persona ID
     */
    async function setPersona(persona) {
        selectedPersona = persona;
        personaContent = await PromptData.getPrompt('personas', persona);
        return personaContent;
    }
    
    /**
     * Sets the selected small talk
     * @param {string} smalltalk - The small talk ID
     */
    async function setSmalltalk(smalltalk) {
        selectedSmalltalk = smalltalk;
        smalltalkContent = await PromptData.getPrompt('smalltalks', smalltalk);
        return smalltalkContent;
    }
    
    /**
     * Sets the selected difficulty level
     * @param {string} level - The level ID
     */
    function setLevel(level) {
        selectedLevel = level;
        
        // Generate level content based on selection
        switch(level) {
            case 'level1':
                levelContent = "Include 1-2 moderate customer objections in the scenario. The customer should express mild concerns that can be addressed with straightforward explanations.";
                break;
            case 'level2':
                levelContent = "Include 2-3 challenging customer objections in the scenario. The customer should be somewhat skeptical and require thoughtful responses to overcome hesitations.";
                break;
            case 'level3':
                levelContent = "Include 4 or more difficult customer objections in the scenario. The customer should be highly resistant with significant concerns that require expert handling and persuasive techniques.";
                break;
            default:
                levelContent = "Include typical customer objections in the scenario as appropriate.";
        }
        
        return levelContent;
    }
    
    /**
     * Generates a combined prompt based on the selected components and order
     * @param {Array} order - Array of component IDs in the desired order
     * @returns {string} - The combined prompt
     */
    function generatePrompt(order) {
        // Validate that all components are selected
        if (!selectedProduct || !selectedPersona || !selectedSmalltalk || !selectedLevel) {
            throw new Error('All components must be selected before generating a prompt');
        }
        
        // Create a mapping of component types to their content and labels
        const promptComponents = {
            'product': {
                'label': 'Product Information',
                'content': productContent
            },
            'persona': {
                'label': 'Persona',
                'content': personaContent
            },
            'smalltalk': {
                'label': 'Small Talk',
                'content': smalltalkContent
            },
            'level': {
                'label': 'Difficulty Level',
                'content': levelContent
            }
        };
        
        // Combine prompts according to the provided order
        let combinedPrompt = "# Combined Prompt\n\n";
        
        for (const componentType of order) {
            if (promptComponents[componentType]) {
                const component = promptComponents[componentType];
                combinedPrompt += `## ${component.label}\n${component.content}\n\n`;
            }
        }
        
        return combinedPrompt;
    }
    
    /**
     * Saves a generated prompt to localStorage
     * @param {string} content - The prompt content
     * @returns {Object} - Information about the saved prompt
     */
    function savePrompt(content) {
        // Create a title for the prompt
        const title = `${selectedProduct} - ${selectedPersona} - ${selectedSmalltalk}`;
        
        // Get existing saved prompts
        const savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
        
        // Create a new prompt object
        const promptObj = {
            id: Date.now().toString(),
            title,
            content,
            timestamp: new Date().toISOString(),
            components: {
                product: selectedProduct,
                persona: selectedPersona,
                smalltalk: selectedSmalltalk
            }
        };
        
        // Add to the saved prompts
        savedPrompts.unshift(promptObj); // Add to the beginning
        
        // Limit to 10 saved prompts
        if (savedPrompts.length > 10) {
            savedPrompts.pop();
        }
        
        // Save to localStorage
        localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
        
        return promptObj;
    }
    
    /**
     * Gets all saved prompts
     * @returns {Array} - Array of saved prompt objects
     */
    function getSavedPrompts() {
        return JSON.parse(localStorage.getItem('savedPrompts') || '[]');
    }
    
    /**
     * Copies the prompt content to clipboard
     * @param {string} content - The prompt content to copy
     * @returns {Promise<boolean>} - Whether the copy was successful
     */
    async function copyToClipboard(content) {
        try {
            await navigator.clipboard.writeText(content);
            return true;
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            return false;
        }
    }
    
    // Public API
    return {
        setProduct,
        setPersona,
        setSmalltalk,
        setLevel,
        generatePrompt,
        savePrompt,
        getSavedPrompts,
        copyToClipboard,
        getSelectedProduct: () => selectedProduct,
        getSelectedPersona: () => selectedPersona,
        getSelectedSmalltalk: () => selectedSmalltalk,
        getSelectedLevel: () => selectedLevel
    };
})();
