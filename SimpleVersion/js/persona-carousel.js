// Persona Carousel Component
class PersonaCarousel {
    constructor(containerId, personas) {
        this.container = document.getElementById(containerId);
        this.personas = personas;
        this.active = 1; // Start with the second card (index 1) in center
        this.maxVisibility = 3;
        this.selectedPersona = null;
        
        this.init();
    }

    init() {
        if (!this.container) return;
        
        // Create carousel structure
        this.container.innerHTML = `
            <div class="persona-carousel">
                <button class="carousel-nav left">
                    <i class="lni lni-chevron-left"></i>
                </button>
                <div class="carousel-track">
                    ${this.personas.map((persona, index) => `
                        <div class="carousel-card-container" data-index="${index}">
                            <persona-card
                                persona-id="${persona.id}"
                                name="${persona.name}"
                                age="${persona.age}"
                                image="${persona.image}"
                                needs='${JSON.stringify(persona.needs)}'
                            ></persona-card>
                        </div>
                    `).join('')}
                </div>
                <button class="carousel-nav right">
                    <i class="lni lni-chevron-right"></i>
                </button>
            </div>
        `;

        // Add event listeners
        this.leftNav = this.container.querySelector('.carousel-nav.left');
        this.rightNav = this.container.querySelector('.carousel-nav.right');
        
        this.leftNav.addEventListener('click', () => this.navigate(-1));
        this.rightNav.addEventListener('click', () => this.navigate(1));
        
        // Listen for persona selection
        this.container.addEventListener('persona-selected', (e) => {
            const clickedIndex = parseInt(e.target.closest('.carousel-card-container').dataset.index);
            
            // If clicked card is not active, navigate to it
            if (clickedIndex !== this.active) {
                const direction = clickedIndex - this.active;
                this.active = clickedIndex;
                this.updateCarousel();
            }
            
            // Update selection
            this.selectedPersona = e.detail;
            this.triggerSelection();
        });
        
        // Initial update
        this.updateCarousel();
        
        // Auto-select the center card after a short delay
        setTimeout(() => {
            this.selectActiveCard();
        }, 100);
    }

    navigate(direction) {
        const newActive = this.active + direction;
        if (newActive >= 0 && newActive < this.personas.length) {
            this.active = newActive;
            this.updateCarousel();
            
            // Auto-select the new center card
            setTimeout(() => {
                this.selectActiveCard();
            }, 400); // Wait for animation to complete
        }
    }

    updateCarousel() {
        const cards = this.container.querySelectorAll('.carousel-card-container');
        
        cards.forEach((card, i) => {
            const offset = (this.active - i) / 3;
            const absOffset = Math.abs(this.active - i) / 3;
            const direction = Math.sign(this.active - i);
            
            card.style.setProperty('--active', i === this.active ? 1 : 0);
            card.style.setProperty('--offset', offset);
            card.style.setProperty('--abs-offset', absOffset);
            card.style.setProperty('--direction', direction);
            
            // Set z-index based on distance from active
            if (i === this.active) {
                card.style.zIndex = '100';
            } else {
                card.style.zIndex = Math.max(1, 10 - Math.abs(this.active - i));
            }
            
            // Handle visibility
            if (Math.abs(this.active - i) >= this.maxVisibility) {
                card.style.opacity = '0';
                card.style.visibility = 'hidden';
                card.style.pointerEvents = 'none';
            } else {
                card.style.opacity = '';
                card.style.visibility = 'visible';
                card.style.pointerEvents = i === this.active ? 'auto' : 'none';
            }
        });
        
        // Update navigation buttons
        this.leftNav.style.display = this.active > 0 ? 'flex' : 'none';
        this.rightNav.style.display = this.active < this.personas.length - 1 ? 'flex' : 'none';
    }

    selectActiveCard() {
        const activeCard = this.container.querySelector(`.carousel-card-container[data-index="${this.active}"]`);
        if (activeCard) {
            const persona = this.personas[this.active];
            this.selectedPersona = {
                id: persona.id,
                name: persona.name,
                age: persona.age,
                image: persona.image,
                needs: persona.needs
            };
            this.triggerSelection();
        }
    }

    triggerSelection() {
        // Update UI elements if they exist
        const personaSelection = document.getElementById('persona-selection');
        if (personaSelection && this.selectedPersona) {
            personaSelection.querySelector('.font-medium').textContent = 
                this.selectedPersona.name;
        }
        
        // Enable next button
        const nextBtn = document.getElementById('next-2');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
        
        // Dispatch event for other components
        this.container.dispatchEvent(new CustomEvent('persona-auto-selected', {
            detail: this.selectedPersona,
            bubbles: true
        }));
    }

    getSelectedPersona() {
        return this.selectedPersona;
    }
}