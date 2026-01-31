import re
from typing import Dict, Optional


def parse_icd_codes(response_text: str) -> Dict[str, Optional[str]]:
    """
    Parse ICD codes from Groq API response.
    Enhanced parser for structured medical prescription data.
    
    Args:
        response_text: Full text response from Groq API
        
    Returns:
        Dictionary with disease_name, disease_icd_code, medicine_name, full_description
    """
    result = {
        "disease_name": None,
        "disease_icd_code": None,
        "medicine_name": None,
        "full_description": response_text
    }
    
    if not response_text:
        return result
    
    # Normalize text for better parsing
    normalized_text = response_text.replace('\r\n', '\n').replace('\r', '\n')
    
    # Look for structured format with headers (from improved prompt)
    # Pattern: **Disease Name:** or Disease Name: or Disease:
    disease_name_patterns = [
        r'\*\*Disease Name\*\*[:\s]+([^\n]+(?:[^\*]|\*(?!\*))+?)(?=\n\*\*|\n\n|$)',
        r'Disease Name[:\s]+([^\n]+)',
        r'Disease[:\s]+([^\n]+)',
        r'Diagnosis[:\s]+([^\n]+)',
        r'Condition[:\s]+([^\n]+)',
    ]
    
    for pattern in disease_name_patterns:
        match = re.search(pattern, normalized_text, re.IGNORECASE | re.MULTILINE)
        if match:
            disease_text = match.group(1).strip()
            # Clean up markdown and formatting
            disease_text = re.sub(r'\*+', '', disease_text)
            disease_text = re.sub(r'\[|\]', '', disease_text)  # Remove brackets
            disease_text = re.sub(r'\s+', ' ', disease_text)
            disease_text = disease_text.strip()
            if disease_text and len(disease_text) > 2:
                result["disease_name"] = disease_text[:200]
                break
    
    # Look for medicine name in structured format
    medicine_name_patterns = [
        r'\*\*Medicine Name\*\*[:\s]+([^\n]+(?:[^\*]|\*(?!\*))+?)(?=\n\*\*|\n\n|$)',
        r'Medicine Name[:\s]+([^\n]+)',
        r'Medication[:\s]+([^\n]+)',
        r'Medicine[:\s]+([^\n]+)',
        r'Drug[:\s]+([^\n]+)',
        r'Prescribed[:\s]+([^\n]+)',
    ]
    
    for pattern in medicine_name_patterns:
        match = re.search(pattern, normalized_text, re.IGNORECASE | re.MULTILINE)
        if match:
            medicine_text = match.group(1).strip()
            medicine_text = re.sub(r'\*+', '', medicine_text)
            medicine_text = re.sub(r'\[|\]', '', medicine_text)
            medicine_text = re.sub(r'\s+', ' ', medicine_text)
            medicine_text = medicine_text.strip()
            if medicine_text and len(medicine_text) > 2:
                result["medicine_name"] = medicine_text[:200]
                break
    
    # Enhanced ICD code pattern - more accurate for ICD-10
    # ICD-10 format: Letter + 2 digits + optional decimal + optional alphanumeric
    icd_patterns = [
        r'\*\*Disease ICD Code\*\*[:\s]+([A-Z]\d{2}(?:\.\d+)?(?:-[A-Z0-9]+)?)',
        r'Disease ICD Code[:\s]+([A-Z]\d{2}(?:\.\d+)?(?:-[A-Z0-9]+)?)',
        r'ICD[-\s]?10[:\s]+([A-Z]\d{2}(?:\.\d+)?(?:-[A-Z0-9]+)?)',
        r'ICD Code[:\s]+([A-Z]\d{2}(?:\.\d+)?(?:-[A-Z0-9]+)?)',
        r'\b([A-Z]\d{2}(?:\.\d+)?(?:-[A-Z0-9]+)?)\b',  # General pattern
    ]
    
    # Try structured extraction first
    for pattern in icd_patterns[:4]:  # First 4 are structured patterns
        match = re.search(pattern, normalized_text, re.IGNORECASE)
        if match:
            code = match.group(1).strip().upper()
            # Validate ICD-10 format
            if re.match(r'^[A-Z]\d{2}(\.\d+)?(-[A-Z0-9]+)?$', code):
                result["disease_icd_code"] = code
                break
    
    # If not found in structured format, search for ICD codes with context
    if not result["disease_icd_code"]:
        # Find all potential ICD codes
        all_codes = re.findall(r'\b([A-Z]\d{2}(?:\.\d+)?(?:-[A-Z0-9]+)?)\b', normalized_text)
        
        # Filter and validate ICD codes
        valid_icd_codes = []
        for code in all_codes:
            code_upper = code.upper()
            # ICD-10 codes start with A-Z and have 2 digits
            if re.match(r'^[A-Z]\d{2}', code_upper):
                valid_icd_codes.append(code_upper)
        
        # Look for disease-related context around codes
        disease_keywords = ['disease', 'disorder', 'condition', 'diagnosis', 'icd', 'code']
        
        for code in valid_icd_codes:
            code_index = normalized_text.find(code)
            if code_index != -1:
                # Get context (150 chars before and after)
                start = max(0, code_index - 150)
                end = min(len(normalized_text), code_index + len(code) + 150)
                context = normalized_text[start:end].lower()
                
                # Check if it's in a disease-related context
                if any(keyword in context for keyword in disease_keywords):
                    result["disease_icd_code"] = code
                    break
        
        # If still not found, use first valid ICD code
        if not result["disease_icd_code"] and valid_icd_codes:
            result["disease_icd_code"] = valid_icd_codes[0]
    
    # Fallback: Extract disease name from medication context if not found
    if not result["disease_name"]:
        # Look for patterns like "for [condition]", "treat [condition]", etc.
        disease_fallback_patterns = [
            r'(?:for|treat|treating|diagnosis|condition|indication)[:\s]+([A-Z][a-z]+(?:\s+[a-z]+){0,5})',
            r'used to treat[:\s]+([A-Z][a-z]+(?:\s+[a-z]+){0,5})',
            r'indicated for[:\s]+([A-Z][a-z]+(?:\s+[a-z]+){0,5})',
        ]
        
        for pattern in disease_fallback_patterns:
            match = re.search(pattern, normalized_text, re.IGNORECASE)
            if match:
                disease_text = match.group(1).strip()
                # Clean up
                disease_text = re.sub(r'[^\w\s-]', '', disease_text)
                disease_text = re.sub(r'\s+', ' ', disease_text)
                if disease_text and len(disease_text) > 3:
                    result["disease_name"] = disease_text[:200]
                    break
    
    # Fallback: Extract medicine name from prescription context if not found
    if not result["medicine_name"]:
        medicine_fallback_patterns = [
            r'prescription[:\s]+([A-Z][a-zA-Z0-9\.\s/-]+)',
            r'medication[:\s]+([A-Z][a-zA-Z0-9\.\s/-]+)',
            r'prescribed[:\s]+([A-Z][a-zA-Z0-9\.\s/-]+)',
            r'drug[:\s]+([A-Z][a-zA-Z0-9\.\s/-]+)',
        ]
        
        for pattern in medicine_fallback_patterns:
            match = re.search(pattern, normalized_text, re.IGNORECASE)
            if match:
                medicine_text = match.group(1).strip()
                # Clean up - remove extra info after common delimiters
                medicine_text = re.sub(r'[,\n].*$', '', medicine_text)  # Remove after comma/newline
                medicine_text = re.sub(r'\s+', ' ', medicine_text)
                if medicine_text and len(medicine_text) > 2:
                    result["medicine_name"] = medicine_text[:200]
                    break
    
    return result
