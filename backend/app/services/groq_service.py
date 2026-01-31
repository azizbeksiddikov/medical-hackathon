import os
import json
import requests
from typing import Optional


GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL_NAME = "meta-llama/llama-4-maverick-17b-128e-instruct"


def call_groq_vlm(image_data_url: str) -> Optional[str]:
    """
    Call Groq VLM API to extract ICD codes from prescription image.
    Optimized for medical prescription analysis.
    
    Args:
        image_data_url: Base64 encoded image data URL
        
    Returns:
        Full response text from the API, or None if error
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set")
    
    # Optimized medical prescription analysis prompt
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": """Please analyze this medical prescription image carefully and provide a detailed description. Focus on:

1. Patient information (name, age, ID if visible)
2. Prescription date
3. Doctor/physician name and credentials
4. All medications prescribed (names, dosages, frequencies)
5. Dosage instructions
6. Any other relevant medical information

Please be thorough and extract all text and medical information from the prescription."""
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": image_data_url
                    }
                }
            ]
        }
    ]
    
    # First pass: Get detailed description
    payload_description = {
        "messages": messages,
        "model": MODEL_NAME,
        "temperature": 0.3,  # Lower temperature for more accurate medical data
        "max_completion_tokens": 2048,  # Increased for detailed medical info
        "top_p": 0.9,
        "stream": True,
        "stop": None
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    try:
        # Get detailed description first
        response = requests.post(
            GROQ_API_URL,
            headers=headers,
            json=payload_description,
            stream=True
        )
        response.raise_for_status()
        
        description = ""
        for line in response.iter_lines():
            if line:
                line_str = line.decode('utf-8')
                if line_str.startswith('data: '):
                    data_str = line_str[6:]
                    if data_str.strip() == '[DONE]':
                        break
                    try:
                        chunk = json.loads(data_str)
                        if 'choices' in chunk and len(chunk['choices']) > 0:
                            delta = chunk['choices'][0].get('delta', {})
                            if 'content' in delta:
                                description += delta['content']
                    except json.JSONDecodeError:
                        continue
        
        if not description:
            return None
        
        # Second pass: Extract structured medical information
        extraction_messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """Based on the prescription analysis, please extract and provide the following information in a structured format:



**Medicine Name:** [The full name(s) of the medication(s) prescribed. Include generic and brand names if both are present.]

**Full Description:** [A comprehensive description of the prescription including patient details, medications, dosages, instructions, and any other relevant medical information.]

Please be precise and accurate. """
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_data_url
                        }
                    }
                ]
            },
            {
                "role": "assistant",
                "content": description
            },
            {
                "role": "user",
                "content": "Now extract the structured information as requested: Disease Name, Disease ICD Code, Medicine Name, and Full Description."
            }
        ]
        
        payload_extraction = {
            "messages": extraction_messages,
            "model": MODEL_NAME,
            "temperature": 0.2,  # Very low temperature for precise extraction
            "max_completion_tokens": 1536,
            "top_p": 0.8,
            "stream": True,
            "stop": None
        }
        
        # Get structured extraction
        response = requests.post(
            GROQ_API_URL,
            headers=headers,
            json=payload_extraction,
            stream=True
        )
        response.raise_for_status()
        
        full_content = ""
        for line in response.iter_lines():
            if line:
                line_str = line.decode('utf-8')
                if line_str.startswith('data: '):
                    data_str = line_str[6:]
                    if data_str.strip() == '[DONE]':
                        break
                    try:
                        chunk = json.loads(data_str)
                        if 'choices' in chunk and len(chunk['choices']) > 0:
                            delta = chunk['choices'][0].get('delta', {})
                            if 'content' in delta:
                                full_content += delta['content']
                    except json.JSONDecodeError:
                        continue
        
        return full_content if full_content else description
        
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error calling Groq API: {str(e)}")


# Language name mapping for translation prompts
LANGUAGE_NAMES = {
    "en": "English",
    "ko": "Korean",
    "zh": "Chinese",
    "ja": "Japanese",
    "es": "Spanish",
    "vi": "Vietnamese",
    "th": "Thai",
    "ru": "Russian",
    "ar": "Arabic",
    "uz": "Uzbek",
}


def translate_with_groq(text: str, target_language: str) -> str:
    """
    Translate text to the target language using Groq LLM.
    
    Args:
        text: Text to translate
        target_language: Target language code (e.g., 'ko', 'zh', 'ja')
        
    Returns:
        Translated text
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set")
    
    language_name = LANGUAGE_NAMES.get(target_language, target_language)
    
    messages = [
        {
            "role": "system",
            "content": f"You are a professional medical translator. Translate the following medical text accurately to {language_name}. Preserve medical terminology and ensure the translation is clear and accurate. Only output the translation, nothing else."
        },
        {
            "role": "user",
            "content": text
        }
    ]
    
    # Use text-only model for translation
    payload = {
        "messages": messages,
        "model": "llama-3.3-70b-versatile",
        "temperature": 0.2,
        "max_completion_tokens": 2048,
        "top_p": 0.9,
        "stream": False,
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    try:
        response = requests.post(
            GROQ_API_URL,
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        
        data = response.json()
        if 'choices' in data and len(data['choices']) > 0:
            return data['choices'][0]['message']['content'].strip()
        
        raise Exception("No translation returned from API")
        
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error calling Groq API for translation: {str(e)}")

