import os
import requests
import json
import re
import sys

# --- CONFIGURATION ---
# This pulls the token from your system's environment variables
FIGMA_TOKEN = os.getenv('FIGMA_ACCESS_TOKEN')

def extract_ids_from_url(url):
    """Extracts file key and node ID from a standard Figma URL."""
    file_key_match = re.search(r'design/([^/]+)', url)
    # Node IDs in URLs use '-' but the API expects ':'
    node_id_match = re.search(r'node-id=([^&]+)', url)

    if not file_key_match:
        print("Error: Could not find File Key in URL.")
        sys.exit(1)

    file_key = file_key_match.group(1)
    node_id = node_id_match.group(1).replace('-', ':') if node_id_match else None

    return file_key, node_id

def prune_node(node):
    """Recursively removes noise to keep the JSON AI-friendly."""
    keep_keys = {
        'id', 'name', 'type', 'visible', 'children',
        'absoluteBoundingBox', 'fills', 'strokes', 'strokeWeight',
        'characters', 'style', 'layoutMode', 'primaryAxisAlignItems',
        'counterAxisAlignItems', 'paddingLeft', 'paddingRight',
        'paddingTop', 'paddingBottom', 'itemSpacing', 'cornerRadius'
    }

    pruned = {k: v for k, v in node.items() if k in keep_keys}

    if 'children' in pruned:
        pruned['children'] = [prune_node(child) for child in pruned['children']]

    return pruned

def fetch_and_display(url):
    if not FIGMA_TOKEN:
        print("Error: FIGMA_ACCESS_TOKEN environment variable is not set.")
        sys.exit(1)

    file_key, node_id = extract_ids_from_url(url)

    # We use the 'nodes' endpoint to get specific component data
    endpoint = f"https://api.figma.com/v1/files/{file_key}/nodes?ids={node_id}"
    headers = {"X-Figma-Token": FIGMA_TOKEN}

    try:
        response = requests.get(endpoint, headers=headers)
        response.raise_for_status() # Raises an error for 4xx/5xx responses

        data = response.json()

        # Figma returns nodes indexed by their ID string
        if node_id not in data['nodes']:
            print(f"Error: Node {node_id} not found in file.")
            return

        raw_node = data['nodes'][node_id]['document']
        clean_data = prune_node(raw_node)

        print(json.dumps(clean_data, indent=2))

    except requests.exceptions.RequestException as e:
        print(f"API Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <FIGMA_URL>")
    else:
        fetch_and_display(sys.argv[1])
