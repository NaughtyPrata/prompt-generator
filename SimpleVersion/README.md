# AIA Thailand Sales Genie - Enhanced UI Version

A polished, app-like implementation of the AIA Thailand Sales Genie prompt generator with an emphasis on visual design and user experience.

## Features

- Modern card-based UI with AIA branding
- Seamless step-by-step wizard interface with animations
- Select from various insurance products with visual representations
- Choose communication personas with visual cues
- Add small talk elements and select difficulty levels
- Generate and save customized sales prompts
- Light/dark mode toggle
- Responsive design optimized for iPad and other devices
- Drag and drop reordering of prompt components
- Local storage for saving prompt history

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- TailwindCSS (via CDN)
- LineIcons (via CDN)
- AnimeJS (via CDN)

## Project Structure

```
SimpleVersion/
├── css/                  # CSS styles
│   └── styles.css        # Main CSS file with AIA branding colors
├── img/                  # Images
│   ├── aia-logo.jpg      # AIA logo
│   └── placeholder-*.jpg # Placeholder images for products
├── js/                   # JavaScript files
│   ├── main.js           # Main application initialization
│   ├── prompt-data.js    # Handles loading prompt data
│   ├── prompt-generator.js # Handles prompt generation
│   └── ui-controller.js  # Manages UI and animations
├── prompts/              # Prompt components
│   ├── personas/         # Persona prompt files
│   ├── products/         # Product prompt files
│   └── smalltalks/       # Small talk prompt files
├── index.html            # Main HTML file
└── serve.sh              # Simple script to serve files locally
```

## Running the Application

You can run the application using the included server script:

```bash
./serve.sh
```

This will start a local web server on port 8080. Open your browser and navigate to:

```
http://localhost:8080
```

## UI Workflow

1. **Select Product**: Choose an insurance product from card-based options with visual indicators
2. **Select Persona**: Choose a communication style with visual representation
3. **Select Options**: Choose small talk elements and difficulty level (internal debug settings)
4. **Generate**: Review selections, customize order, and generate the prompt
5. **Result**: View, copy, and save the generated prompt

## Design Improvements

This version features significant UI/UX improvements:

1. **Card-Based Selection**: Products and personas are presented as visual cards
2. **Visual Navigation**: Step indicators use icons instead of numbers
3. **Improved Layout**: Two-column layout for better space utilization
4. **Visual Hierarchy**: Clear section headings and organized content
5. **Difficulty Levels**: Added option to specify customer objection difficulty
6. **Internal Banners**: Clear indicators for debug/internal sections
7. **Improved Results Page**: Better formatted output with AIA branding

## Adding New Components

To add new prompt components:

1. Add new text files to the appropriate directory:
   - Product prompts: `prompts/products/`
   - Persona styles: `prompts/personas/`
   - Small talk elements: `prompts/smalltalks/`

2. For new products, add corresponding entries to the `aiaProducts` array in `main.js`

## Future Enhancements

- Add real product images from AIA Thailand
- Implement actual persona illustrations
- Connect to an AI avatar system for demonstration
- Add animation transitions between steps
- Implement a backend API for prompt sharing if needed
