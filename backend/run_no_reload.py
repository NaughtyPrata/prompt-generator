#!/usr/bin/env python3
"""
Run Flask app without using the watchdog reloader
This is a workaround for environments with watchdog compatibility issues
"""

import os
from app import app

if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5001))
    
    print("Starting Flask app without reloader...")
    print(f"Running on port {port}")
    print("NOTE: Changes to Python files won't auto-reload the server!")
    app.run(debug=True, host='0.0.0.0', port=port, use_reloader=False)
