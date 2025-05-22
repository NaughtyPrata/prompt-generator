from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import datetime
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.DEBUG, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)
PROMPTS_DIR = os.path.join(PARENT_DIR, 'prompts')
OUTPUT_DIR = os.path.join(PARENT_DIR, 'output')

# Ensure directories exist
os.makedirs(OUTPUT_DIR, exist_ok=True)
for dir_name in ['products', 'personas', 'smalltalks']:
    os.makedirs(os.path.join(PROMPTS_DIR, dir_name), exist_ok=True)

@app.route('/api/prompts', methods=['GET'])
def get_prompts():
    """Get all available prompts categorized by type"""
    try:
        logger.info("Fetching prompts from directories")
        
        products_dir = os.path.join(PROMPTS_DIR, 'products')
        personas_dir = os.path.join(PROMPTS_DIR, 'personas')
        smalltalks_dir = os.path.join(PROMPTS_DIR, 'smalltalks')
        
        logger.debug(f"Products directory: {products_dir}")
        logger.debug(f"Personas directory: {personas_dir}")
        logger.debug(f"Smalltalks directory: {smalltalks_dir}")
        
        # Check if directories exist
        if not os.path.exists(products_dir):
            logger.error(f"Products directory does not exist: {products_dir}")
            return jsonify({"error": "Products directory not found"}), 500
            
        if not os.path.exists(personas_dir):
            logger.error(f"Personas directory does not exist: {personas_dir}")
            return jsonify({"error": "Personas directory not found"}), 500
            
        if not os.path.exists(smalltalks_dir):
            logger.error(f"Smalltalks directory does not exist: {smalltalks_dir}")
            return jsonify({"error": "Smalltalks directory not found"}), 500
        
        # List files in each directory
        products = [f.replace('.txt', '') for f in os.listdir(products_dir) 
                   if f.endswith('.txt')]
        personas = [f.replace('.txt', '') for f in os.listdir(personas_dir) 
                   if f.endswith('.txt')]
        smalltalks = [f.replace('.txt', '') for f in os.listdir(smalltalks_dir) 
                     if f.endswith('.txt')]
        
        logger.info(f"Found products: {products}")
        logger.info(f"Found personas: {personas}")
        logger.info(f"Found smalltalks: {smalltalks}")
        
        return jsonify({
            'products': products,
            'personas': personas,
            'smalltalks': smalltalks
        })
    except Exception as e:
        logger.error(f"Error fetching prompts: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate', methods=['POST'])
def generate_prompt():
    """Generate a complete prompt from selected components"""
    try:
        data = request.json
        logger.info(f"Received generate request with data: {data}")
        
        product = data.get('product')
        persona = data.get('persona')
        smalltalk = data.get('smalltalk')
        prompt_order = data.get('promptOrder', ['product', 'persona', 'smalltalk'])  # Default order if not provided
        
        logger.info(f"Using prompt order: {prompt_order}")
        
        if not product or not persona or not smalltalk:
            return jsonify({
                'success': False,
                'message': 'Missing required parameters'
            }), 400
        
        # Read product prompt
        product_path = os.path.join(PROMPTS_DIR, 'products', f"{product}.txt")
        logger.debug(f"Reading product from: {product_path}")
        if not os.path.exists(product_path):
            return jsonify({
                'success': False,
                'message': f'Product prompt file not found: {product}'
            }), 404
            
        with open(product_path, 'r') as f:
            product_content = f.read()
        
        # Read persona prompt
        persona_path = os.path.join(PROMPTS_DIR, 'personas', f"{persona}.txt")
        logger.debug(f"Reading persona from: {persona_path}")
        if not os.path.exists(persona_path):
            return jsonify({
                'success': False,
                'message': f'Persona prompt file not found: {persona}'
            }), 404
            
        with open(persona_path, 'r') as f:
            persona_content = f.read()
        
        # Read smalltalk prompt
        smalltalk_path = os.path.join(PROMPTS_DIR, 'smalltalks', f"{smalltalk}.txt")
        logger.debug(f"Reading smalltalk from: {smalltalk_path}")
        if not os.path.exists(smalltalk_path):
            return jsonify({
                'success': False,
                'message': f'Smalltalk prompt file not found: {smalltalk}'
            }), 404
            
        with open(smalltalk_path, 'r') as f:
            smalltalk_content = f.read()
        
        # Create a mapping of prompt types to their content and labels
        prompt_components = {
            'product': {
                'label': 'Product Information',
                'content': product_content
            },
            'persona': {
                'label': 'Persona',
                'content': persona_content
            },
            'smalltalk': {
                'label': 'Small Talk',
                'content': smalltalk_content
            }
        }
        
        # Combine prompts according to the provided order
        combined_prompt = "# Combined Prompt\n\n"
        
        for component_type in prompt_order:
            if component_type in prompt_components:
                component = prompt_components[component_type]
                combined_prompt += f"## {component['label']}\n{component['content']}\n\n"
        
        # Generate filename with timestamp
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"prompt_{product}_{persona}_{smalltalk}_{timestamp}.txt"
        file_path = os.path.join(OUTPUT_DIR, filename)
        
        # Save to file
        with open(file_path, 'w') as f:
            f.write(combined_prompt)
        
        logger.info(f"Generated prompt saved to: {file_path}")
        
        return jsonify({
            'success': True,
            'message': f'Prompt generated and saved as {filename}',
            'filename': filename,
            'content': combined_prompt
        })
    except Exception as e:
        logger.error(f"Error generating prompt: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'success': False,
            'message': f'Error generating prompt: {str(e)}'
        }), 500

@app.route('/api/outputs', methods=['GET'])
def get_outputs():
    """Get list of generated output files"""
    try:
        if not os.path.exists(OUTPUT_DIR):
            os.makedirs(OUTPUT_DIR, exist_ok=True)
            
        outputs = [f for f in os.listdir(OUTPUT_DIR) if f.endswith('.txt')]
        outputs.sort(reverse=True)  # Most recent first
        
        logger.info(f"Found {len(outputs)} output files")
        
        return jsonify({
            'outputs': outputs
        })
    except Exception as e:
        logger.error(f"Error getting outputs: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/output/<filename>', methods=['GET'])
def get_output_content(filename):
    """Get content of a specific output file"""
    try:
        file_path = os.path.join(OUTPUT_DIR, filename)
        logger.debug(f"Reading output file: {file_path}")
        
        if not os.path.exists(file_path):
            logger.warning(f"Output file not found: {file_path}")
            return jsonify({
                'success': False,
                'message': 'File not found'
            }), 404
        
        with open(file_path, 'r') as f:
            content = f.read()
        
        return jsonify({
            'success': True,
            'content': content,
            'filename': filename
        })
    except Exception as e:
        logger.error(f"Error reading output file: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'success': False,
            'message': f'Error reading output file: {str(e)}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check endpoint"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.datetime.now().isoformat()
    })

if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5001))
    
    logger.info("Starting Flask application")
    logger.info(f"BASE_DIR: {BASE_DIR}")
    logger.info(f"PARENT_DIR: {PARENT_DIR}")
    logger.info(f"PROMPTS_DIR: {PROMPTS_DIR}")
    logger.info(f"OUTPUT_DIR: {OUTPUT_DIR}")
    logger.info(f"Using port: {port}")
    
    try:
        # Try to run with default reloader
        app.run(debug=True, host='0.0.0.0', port=port)
    except ImportError as e:
        if 'watchdog' in str(e) or 'EVENT_TYPE_OPENED' in str(e):
            logger.warning("Watchdog reloader issue detected. Running without reloader.")
            # Run without watchdog reloader
            app.run(debug=True, host='0.0.0.0', port=port, use_reloader=False)
        else:
            # Re-raise if it's a different ImportError
            raise
