// Persona Data Loader
class PersonaDataLoader {
    static async loadPersonas() {
        try {
            // For now, we'll use a hardcoded version
            const personas = [
                {
                    id: 'persona-1',
                    name: 'Michael Chen',
                    age: 28,
                    image: 'michael-chen.jpg',
                    needs: [
                        'Quick and efficient service',
                        'Digital-first solutions',
                        'Transparent pricing'
                    ]
                },
                {
                    id: 'persona-2',
                    name: 'Lisa Thompson',
                    age: 35,
                    image: 'lisa-thompson.jpg',
                    needs: [
                        'Family protection plans',
                        'Educational savings',
                        'Comprehensive coverage'
                    ]
                },
                {
                    id: 'persona-3',
                    name: 'David Kumar',
                    age: 42,
                    image: 'david-kumar.jpg',
                    needs: [
                        'Investment opportunities',
                        'Retirement planning',
                        'Tax optimization'
                    ]
                },
                {
                    id: 'persona-4',
                    name: 'Sarah Williams',
                    age: 55,
                    image: 'sarah-williams.jpg',
                    needs: [
                        'Health coverage',
                        'Legacy planning',
                        'Peace of mind'
                    ]
                }
            ];

            return personas;
        } catch (error) {
            console.error('Error loading personas:', error);
            return [];
        }
    }

    // Alternative: Load from JSON file
    static async loadPersonasFromJSON() {
        try {
            const response = await fetch('data/personas.json');
            const data = await response.json();
            return data.personas;
        } catch (error) {
            console.error('Error loading personas from JSON:', error);
            return this.loadPersonas(); // Fallback to hardcoded
        }
    }
}