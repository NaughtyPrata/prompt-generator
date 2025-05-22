/**
 * Prompt Data Handler
 * Manages loading and accessing prompt data from the file system
 */

const PromptData = (function() {
    // Cache for prompt data
    const promptCache = {
        products: {},
        personas: {},
        smalltalks: {}
    };
    
    // Lists of available prompts
    let productsList = [];
    let personasList = [];
    let smalltalksList = [];
    
    /**
     * Reads a text file from the prompts directory
     * @param {string} type - The prompt type (products, personas, smalltalks)
     * @param {string} name - The name of the prompt file without extension
     * @returns {Promise<string>} - The content of the prompt file
     */
    async function readPromptFile(type, name) {
        try {
            // Check if it's already in cache
            if (promptCache[type][name]) {
                return promptCache[type][name];
            }
            
            // Fetch the file
            const response = await fetch(`prompts/${type}/${name}.txt`);
            if (!response.ok) {
                throw new Error(`Failed to load ${type}/${name}.txt: ${response.status}`);
            }
            
            const content = await response.text();
            
            // Cache the result
            promptCache[type][name] = content;
            
            return content;
        } catch (error) {
            console.error(`Error reading prompt file: ${error.message}`);
            return '';
        }
    }
    
    /**
     * Fetches the list of available prompts for each type
     * @returns {Promise<Object>} - Object containing arrays of prompt names
     */
    async function loadPromptLists() {
        try {
            // In a real application, we would fetch this from the server
            // For simplicity, we'll use a static list based on what's in the directory
            
            // For products
            const productsResponse = await fetch('prompts/products/');
            if (!productsResponse.ok) {
                throw new Error(`Failed to load products directory: ${productsResponse.status}`);
            }
            
            // Since we can't actually read the directory contents without a server,
            // we'll use a predefined list
            productsList = ['product1', 'product2', 'product3', 'product4'];
            personasList = ['educational', 'empathetic', 'friendly', 'professional'];
            smalltalksList = ['continuity', 'motivational', 'seasonal', 'tech_fact'];
            
            return {
                products: productsList,
                personas: personasList,
                smalltalks: smalltalksList
            };
        } catch (error) {
            console.error(`Error loading prompt lists: ${error.message}`);
            
            // Fallback to predefined lists if fetch fails
            productsList = ['product1', 'product2', 'product3', 'product4'];
            personasList = ['educational', 'empathetic', 'friendly', 'professional'];
            smalltalksList = ['continuity', 'motivational', 'seasonal', 'tech_fact'];
            
            return {
                products: productsList,
                personas: personasList,
                smalltalks: smalltalksList
            };
        }
    }
    
    // Public API
    return {
        init: loadPromptLists,
        getPrompt: readPromptFile,
        getProductsList: () => productsList,
        getPersonasList: () => personasList,
        getSmalltalksList: () => smalltalksList
    };
})();
