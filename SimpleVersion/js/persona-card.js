// Persona Card Web Component (Light DOM)
class PersonaCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Get attributes
        const id = this.getAttribute('persona-id') || '';
        const name = this.getAttribute('name') || 'Unknown';
        const age = this.getAttribute('age') || '';
        const image = this.getAttribute('image') || '';
        const needs = this.getAttribute('needs') || '';

        // Parse needs if it's a JSON string
        let needsText = '';
        try {
            const needsList = JSON.parse(needs);
            needsText = needsList.join(', ');
        } catch (e) {
            needsText = needs;
        }

        // Create the card structure - horizontal layout
        this.innerHTML = `
            <div class="persona-card-container" data-persona-id="${id}">
                <div class="persona-card">
                    <div class="persona-image-wrapper">
                        ${image ? 
                            `<img src="img/personas/${image}" alt="${name}" class="persona-image">` : 
                            `<div class="persona-placeholder">
                                Image will go here
                            </div>`
                        }
                    </div>
                    <div class="persona-content">
                        <h3 class="persona-name" style="color: #2d2d2d !important;">${name}</h3>
                        ${age ? `<p class="persona-age" style="color: #58595b !important;">Age ${age}</p>` : ''}
                        <div class="persona-needs">
                            <h4 class="persona-needs-title" style="color: #2d2d2d !important;">Needs</h4>
                            <p class="persona-needs-list" style="color: #58595b !important;">${needsText}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add click handler
        this.querySelector('.persona-card').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('persona-selected', {
                detail: { id, name, age, image, needs: needsText },
                bubbles: true
            }));
        });
    }
}

// Register the custom element
customElements.define('persona-card', PersonaCard);