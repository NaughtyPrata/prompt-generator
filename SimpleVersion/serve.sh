#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting SimpleVersion server...${NC}"

# Check if Python is installed
if command -v python3 &>/dev/null; then
    echo -e "${GREEN}Using Python 3 to serve files${NC}"
    cd "$(dirname "$0")"
    python3 -m http.server 8080
elif command -v python &>/dev/null; then
    echo -e "${GREEN}Using Python 2 to serve files${NC}"
    cd "$(dirname "$0")"
    python -m SimpleHTTPServer 8080
else
    echo -e "${YELLOW}Python not found. Using Node.js http-server if available...${NC}"
    
    # Check if npx is available
    if command -v npx &>/dev/null; then
        echo -e "${GREEN}Using npx http-server${NC}"
        cd "$(dirname "$0")"
        npx http-server -p 8080
    else
        echo -e "${YELLOW}Neither Python nor Node.js http-server are available.${NC}"
        echo "Please install one of the following:"
        echo "1. Python 3 (recommended)"
        echo "2. Node.js + npm"
        echo "Then run this script again."
        exit 1
    fi
fi
