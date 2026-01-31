# Quick Start - Testing ICD Extraction

## Step 1: Start the Backend

```bash
# Make sure you're in the project root
cd /Users/uddinsiyam/ascent/medical-hackathon

# Start all services (backend + frontend)
docker compose up --build

# Or just backend
docker compose up backend
```

Wait until you see:
```
backend-1  | INFO:     Uvicorn running on http://0.0.0.0:9090
```

## Step 2: Verify Backend is Running

Open a new terminal and run:

```bash
curl http://localhost:9090/health
```

You should see: `{"status":"ok"}`

## Step 3: Test ICD Extraction

### Option A: Using the Test Script (Easiest)

```bash
# Make sure you have a prescription image
python test_icd_extraction.py /path/to/your/prescription.jpg
```

### Option B: Using cURL

```bash
curl -X POST "http://localhost:9090/extract-icd" \
  -F "file=@/path/to/your/prescription.jpg" \
  | python -m json.tool
```

### Option C: Using Python

```python
import requests

with open('prescription.jpg', 'rb') as f:
    files = {'file': ('prescription.jpg', f, 'image/jpeg')}
    response = requests.post('http://localhost:9090/extract-icd', files=files)
    print(response.json())
```

## Expected Output

```json
{
  "disease_name": "...",
  "disease_icd_code": "...",
  "medicine_name": "...",
  "full_description": "..."
}
```

## Troubleshooting

- **Backend not starting?** Check `docker compose logs backend`
- **API key error?** Verify `.env` has `GROQ_API_KEY` set
- **Connection refused?** Make sure backend is running on port 9090
- **Timeout?** Groq API calls can take 10-30 seconds, be patient

For more details, see [TESTING_GUIDE.md](TESTING_GUIDE.md)

