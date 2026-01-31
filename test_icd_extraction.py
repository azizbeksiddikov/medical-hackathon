#!/usr/bin/env python3
"""
Test script for ICD extraction endpoint.
Usage: python test_icd_extraction.py <path_to_prescription_image>
"""

import sys
import requests
import json
from pathlib import Path


def test_icd_extraction(image_path: str, base_url: str = "http://localhost:9090"):
    """
    Test the ICD extraction endpoint with a prescription image.
    
    Args:
        image_path: Path to the prescription image file
        base_url: Base URL of the API (default: http://localhost:9090)
    """
    # Check if file exists
    if not Path(image_path).exists():
        print(f"Error: Image file not found: {image_path}")
        return False
    
    # Check health endpoint first
    try:
        health_response = requests.get(f"{base_url}/health", timeout=5)
        if health_response.status_code != 200:
            print(f"Error: Health check failed. Status: {health_response.status_code}")
            return False
        print("✓ Backend is running")
    except requests.exceptions.ConnectionError:
        print(f"Error: Cannot connect to backend at {base_url}")
        print("Make sure the backend is running. Try: docker compose up")
        return False
    
    # Prepare file upload
    url = f"{base_url}/extract-icd"
    
    try:
        with open(image_path, 'rb') as image_file:
            files = {'file': (Path(image_path).name, image_file, 'image/jpeg')}
            
            print(f"\n📤 Uploading image: {image_path}")
            print(f"📡 Sending request to: {url}")
            
            response = requests.post(url, files=files, timeout=60)
            
            print(f"\n📥 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print("\n✅ Success! Extracted ICD Codes:")
                print("=" * 50)
                print(json.dumps(result, indent=2))
                print("=" * 50)
                return True
            else:
                print(f"\n❌ Error: {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"Details: {json.dumps(error_detail, indent=2)}")
                except:
                    print(f"Details: {response.text}")
                return False
                
    except FileNotFoundError:
        print(f"Error: File not found: {image_path}")
        return False
    except requests.exceptions.Timeout:
        print("Error: Request timed out. The API call may be taking too long.")
        return False
    except Exception as e:
        print(f"Error: {str(e)}")
        return False


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_icd_extraction.py <path_to_prescription_image>")
        print("\nExample:")
        print("  python test_icd_extraction.py ./test_prescription.jpg")
        sys.exit(1)
    
    image_path = sys.argv[1]
    success = test_icd_extraction(image_path)
    sys.exit(0 if success else 1)

