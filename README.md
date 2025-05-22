# AIA Thailand Sales Genie

A step-by-step wizard tool for generating customized sales prompts by combining product information, persona styles, and small talk elements.

## Features

- Interactive step-by-step wizard interface with animations
- Select from various product descriptions, personas, and small talk elements
- Generate and save customized sales prompts
- View previously generated prompts
- Responsive design with light/dark mode toggle using separate theme CSS files
- Enhanced UI with PrimeReact components and Framer Motion animations

## Project Structure

```
prompt-generator/
├── backend/              # Python Flask backend
│   ├── app.py            # Main server code
│   └── requirements.txt  # Python dependencies
├── frontend/             # React frontend
│   ├── public/           # Static assets
│   └── src/              # React components and styles
├── prompts/              # Modular prompt components
│   ├── products/         # Product-specific prompts
│   ├── personas/         # Persona-style prompts
│   └── smalltalks/       # Small talk elements
└── output/               # Generated and saved prompts
```

## Setup Instructions

### All-in-One Deployment

Use the deploy script to install all dependencies and start the application:

```
./deploy.sh
```

This will set up both the frontend and backend automatically.

### Backend Setup

#### Using the Start Script (Recommended)

The easiest way to start the backend is using the provided script that automatically sets up a virtual environment:

```
./start.sh
```

This will:
1. Create a Python virtual environment in the `backend/venv` directory
2. Install the required dependencies
3. Start the Flask server

#### Manual Setup with Virtual Environment

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python3 -m venv venv
   ```

3. Activate the virtual environment:
   ```
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install dependencies in the virtual environment:
   ```
   pip install -r requirements.txt
   ```

5. Start the Flask server:
   ```
   python app.py
   ```
   The server will run on http://localhost:5001

### Troubleshooting Backend Issues

#### Watchdog Error

If you encounter an error like this when starting the Flask server:

```
ImportError: cannot import name 'EVENT_TYPE_OPENED' from 'watchdog.events'
```

You have two options to fix it:

1. **Use the fix script**:
   ```
   ./backend/fix_watchdog.sh
   ```
   This will reinstall the compatible version of the watchdog package.

2. **Run without the reloader**:
   ```
   python backend/run_no_reload.py
   ```
   This bypasses the problematic watchdog reloader but won't automatically reload when you change Python files.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   The application will be available at http://localhost:3000

## Usage

1. **Step 1**: Select a product from the dropdown menu and click "Next".
2. **Step 2**: Select a persona style from the dropdown menu and click "Next".
3. **Step 3**: Select a small talk element from the dropdown menu and click "Next".
4. **Step 4**: Review your selections and click "Generate Prompt" to create a combined prompt.
5. The generated prompt will be displayed and saved to the output directory.
6. View previously generated prompts by clicking on them in the list on the results page.
7. Use the theme toggle in the top-right corner to switch between light and dark modes.

## Adding New Prompts

To add new prompt components:

1. Add new text files to the appropriate directory:
   - Product prompts: `prompts/products/`
   - Persona styles: `prompts/personas/`
   - Small talk elements: `prompts/smalltalks/`

2. Each file should be saved with a descriptive name and a `.txt` extension.
3. Restart the backend server to detect the new prompt files.

## Theme Customization

The application uses separate CSS files for theme management:

1. The theme files are located in `frontend/public/styles/`:
   - `light-theme.css` - Default light theme
   - `dark-theme.css` - Dark theme

2. To customize a theme, edit the CSS variables at the top of each theme file to adjust colors, shadows, etc.

3. The toggle between themes is handled by the ThemeToggle component which dynamically loads the appropriate CSS file and sets a class on the body element.

4. User theme preferences are saved in localStorage for persistence between sessions.
