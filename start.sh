#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to run diagnostic check
run_diagnostic() {
    echo -e "${YELLOW}Running diagnostic check...${NC}"
    cd backend
    python3 diagnostic.py
    DIAGNOSTIC_RESULT=$?
    cd ..
    
    if [ $DIAGNOSTIC_RESULT -ne 0 ]; then
        echo -e "${RED}Diagnostic check failed. Please fix the issues before starting the servers.${NC}"
        exit 1
    fi
}

# Setup and activate virtual environment
setup_venv() {
    echo -e "${YELLOW}Setting up Python virtual environment...${NC}"
    # Check if venv directory exists
    if [ ! -d "backend/venv" ]; then
        echo -e "${YELLOW}Creating new virtual environment...${NC}"
        cd backend
        python3 -m venv venv
        VENV_RESULT=$?
        if [ $VENV_RESULT -ne 0 ]; then
            echo -e "${RED}Failed to create virtual environment. Please install venv:${NC}"
            echo "python3 -m pip install --user virtualenv"
            exit 1
        fi
        cd ..
    fi
    
    # Activate virtual environment
    echo -e "${YELLOW}Activating virtual environment...${NC}"
    source backend/venv/bin/activate
    
    # Install dependencies in the virtual environment
    echo -e "${YELLOW}Installing dependencies in virtual environment...${NC}"
    cd backend
    pip install -r requirements.txt
    PIP_RESULT=$?
    if [ $PIP_RESULT -ne 0 ]; then
        echo -e "${RED}Failed to install dependencies in virtual environment.${NC}"
        exit 1
    fi
    cd ..
}

# Run the diagnostic check
run_diagnostic

# Setup virtual environment
setup_venv

# Start the backend server
echo -e "${GREEN}Starting Flask backend server in virtual environment...${NC}"
cd backend
# Make sure we're still in the virtual environment
if [ -z "$VIRTUAL_ENV" ]; then
    source venv/bin/activate
fi

# Try the regular app first, fall back to no-reload version if it fails
python app.py &
BACKEND_PID=$!

# Wait a moment to see if it starts properly
sleep 2

# Check if it failed with the watchdog error
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${YELLOW}Regular start failed. Trying with reloader disabled...${NC}"
    python run_no_reload.py &
    BACKEND_PID=$!
fi

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 3

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${RED}Backend server failed to start. Check the logs above for errors.${NC}"
    # Deactivate virtual environment
    deactivate
    exit 1
fi

# Check if API is accessible
echo -e "${YELLOW}Checking if API is accessible...${NC}"
if ! curl -s http://localhost:5001/api/health > /dev/null; then
    echo -e "${RED}API is not accessible. Backend server might have failed to start properly.${NC}"
    kill $BACKEND_PID
    # Deactivate virtual environment
    deactivate
    exit 1
fi

echo -e "${GREEN}Backend server started successfully!${NC}"

# Start the Vite frontend
echo -e "${GREEN}Starting Vite frontend...${NC}"
cd ../frontend
npx --yes vite &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
    echo -e "${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID
    # Deactivate virtual environment
    deactivate
    exit 0
}

# Set up trap to call cleanup function when script is terminated
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}Both servers are running. Press Ctrl+C to stop.${NC}"

# Keep the script running
while true; do
    sleep 1
    # Check if backend is still running
    if ! ps -p $BACKEND_PID > /dev/null; then
        echo -e "${RED}Backend server stopped unexpectedly. Shutting down...${NC}"
        kill $FRONTEND_PID
        # Deactivate virtual environment
        deactivate
        exit 1
    fi
    # Check if frontend is still running
    if ! ps -p $FRONTEND_PID > /dev/null; then
        echo -e "${RED}Frontend server stopped unexpectedly. Shutting down...${NC}"
        kill $BACKEND_PID
        # Deactivate virtual environment
        deactivate
        exit 1
    fi
done
