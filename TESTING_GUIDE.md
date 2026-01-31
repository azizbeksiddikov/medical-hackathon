# Testing Guide for ICD Extraction API

This guide will help you test the Groq VLM integration for extracting ICD codes from prescription images.

## Prerequisites

1. **Backend is running**: Make sure your backend service is up and running
2. **Environment variables**: Ensure `.env` file has `GROQ_API_KEY` set
3. **Test image**: Have a prescription image ready for testing

## Method 1: Using the Python Test Script (Recommended)

### Step 1: Start the Backend

```bash
# From project root
docker compose up --build

# Or if already built
docker compose up
```

Wait for the backend to start. You should see:
```
backend-1  | INFO:     Uvicorn running on http://0.0.0.0:9090
```

### Step 2: Run the Test Script

```bash
# Make sure you have a prescription image file
python test_icd_extraction.py <path_to_your_image>

# Example:
python test_icd_extraction.py ./prescription.jpg
```

The script will:
- Check if backend is running
- Upload the image
- Display the extracted ICD codes in JSON format

## Method 2: Using cURL

### Basic Test

```bash
curl -X POST "http://localhost:9090/extract-icd" \
  -F "file=@/path/to/your/prescription.jpg" \
  -H "Content-Type: multipart/form-data"
```

### Pretty Print JSON Response

```bash
curl -X POST "http://localhost:9090/extract-icd" \
  -F "file=@/path/to/your/prescription.jpg" \
  -H "Content-Type: multipart/form-data" \
  | python -m json.tool
```

### Save Response to File

```bash
curl -X POST "http://localhost:9090/extract-icd" \
  -F "file=@/path/to/your/prescription.jpg" \
  -H "Content-Type: multipart/form-data" \
  -o response.json
```

## Method 3: Using Python Requests (Interactive)

```python
import requests

# Upload image
with open('prescription.jpg', 'rb') as f:
    files = {'file': ('prescription.jpg', f, 'image/jpeg')}
    response = requests.post('http://localhost:9090/extract-icd', files=files)

print(response.json())
```

## Method 4: Using Postman or Insomnia

1. **Method**: POST
2. **URL**: `http://localhost:9090/extract-icd`
3. **Body Type**: form-data
4. **Key**: `file` (type: File)
5. **Value**: Select your prescription image file
6. **Send**: Click Send

## Expected Response Format

```json
{
  "disease_name": "Gastrointestinal disorders or motion sickness",
  "disease_icd_code": "R10-R19",
  "medicine_name": "Tr. Belladonna",
  "full_description": "The image shows a prescription form..."
}
```

## Testing Health Endpoint

Before testing the ICD extraction, verify the backend is running:

```bash
curl http://localhost:9090/health
```

Expected response:
```json
{"status": "ok"}
```

## Troubleshooting

### Backend Not Running
```bash
# Check if containers are running
docker ps

# Check logs
docker compose logs backend

# Restart services
docker compose restart backend
```

### Environment Variable Not Set
```bash
# Check if .env file exists and has GROQ_API_KEY
cat .env

# Make sure docker-compose.yml loads .env
# It should have:
#   env_file:
#     - .env
```

### API Key Error
If you get an error about `GROQ_API_KEY`:
1. Check `.env` file has the key
2. Restart the backend: `docker compose restart backend`
3. Check logs: `docker compose logs backend`

### Image Upload Error
- Make sure the file is a valid image (JPEG, PNG, WEBP)
- Check file size (very large images may timeout)
- Verify file path is correct

### Timeout Errors
- Groq API calls can take 10-30 seconds
- Increase timeout in your client if needed
- Check Groq API status if consistently timing out

## Example Test Image

You can use any prescription image. The API will:
1. Analyze the image using Groq VLM
2. Extract text and medical information
3. Identify disease names and ICD codes
4. Identify medicine names and ICD codes
5. Return structured JSON response

## Next Steps

After successful testing:
1. Integrate the endpoint into your frontend
2. Add error handling in your UI
3. Consider adding request validation
4. Add logging for production use

