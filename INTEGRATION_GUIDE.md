# CBC Analysis Integration Guide

## Overview

The CBC Analysis application is now fully integrated with the backend API. The frontend React application communicates with the FastAPI backend to analyze Complete Blood Count (CBC) values using machine learning models.

## System Architecture

### Backend (FastAPI)

- **Location**: `backend/app.py`
- **Port**: 8000
- **Features**:
  - Two-stage ML pipeline for CBC analysis
  - Stage 1: Clinically significant CBC screening
  - Stage 2: Multi-class condition prediction
  - Ontology-based support scoring
  - Urgent attention detection
  - Recommended confirmatory tests

### Frontend (React + TypeScript)

- **Port**: 8080 (or 5173)
- **Key Files**:
  - `src/pages/Analyze.tsx` - CBC input form page
  - `src/pages/Results.tsx` - Analysis results display
  - `src/components/CBCInputForm.tsx` - Form component
  - `src/services/api.ts` - API communication layer
  - `src/types/api.ts` - TypeScript type definitions

## How It Works

### 1. User Input (Frontend)

The user enters CBC values in the form at `/analyze`:

- WBC, RBC, Hemoglobin, Hematocrit
- MCV, MCH, MCHC
- Platelets
- Neutrophils %, Lymphocytes %, etc.

### 2. Data Processing (Frontend)

- Values are validated and checked against normal ranges
- Field names are mapped to backend canonical names (e.g., `neutrophils` → `neut_pct`)
- Flags (LOW/NORMAL/HIGH) are automatically determined based on normal ranges
- Missing values are handled gracefully by the backend using median imputation

### 3. API Request (Frontend → Backend)

```typescript
POST http://localhost:8000/predict
{
  "cbc_values": {
    "wbc": 4.5,
    "hemoglobin": 10.2,
    "platelets": 180,
    // ...
  },
  "cbc_flags": {
    "wbc": "NORMAL",
    "hemoglobin": "LOW",
    "platelets": "NORMAL"
  },
  "top_k": 3
}
```

### 4. ML Analysis (Backend)

- Stage 1 model: Determines if CBC is clinically significant
- Stage 2 model: Predicts top K most probable conditions
- Ontology engine: Scores support for each condition
- Urgent attention rules: Checks for critical values
- Test recommendations: Suggests confirmatory tests

### 5. Response (Backend → Frontend)

```json
{
  "stage1": {
    "clinically_significant_cbc": true,
    "confidence": 0.95
  },
  "top_predictions": [
    {
      "rank": 1,
      "condition": "Iron Deficiency Anemia",
      "probability": 0.78,
      "probability_percent": 78.0
    }
  ],
  "ontology_support": [...],
  "urgent_attention": {
    "urgent_flag": false,
    "reasons": []
  },
  "recommended_tests": [...]
}
```

### 6. Display Results (Frontend)

- Transforms API data to UI format
- Shows probability rings for each condition
- Displays key features and clinical reasoning
- Lists recommended confirmatory tests
- Shows urgent attention banner if needed

## Field Mapping

The frontend form fields map to backend model features as follows:

| Frontend Field | Backend Feature | Type         | Normal Range     |
| -------------- | --------------- | ------------ | ---------------- |
| wbc            | wbc             | Core         | 4.5-11.0 ×10³/µL |
| rbc            | rbc             | Core         | 4.5-5.5 ×10⁶/µL  |
| hemoglobin     | hemoglobin      | Core         | 12-17 g/dL       |
| hematocrit     | hematocrit      | Core         | 36-50 %          |
| platelets      | platelets       | Core         | 150-400 ×10³/µL  |
| mcv            | mcv             | Index        | 80-100 fL        |
| mch            | mch             | Index        | 27-33 pg         |
| mchc           | mchc            | Index        | 32-36 g/dL       |
| neutrophils    | neut_pct        | Differential | 40-70 %          |
| lymphocytes    | lymp_pct        | Differential | 20-40 %          |

**Note**: The backend model also accepts absolute counts (`neut_abs`, `lymp_abs`) which can be calculated from percentages and WBC if needed.

## Running the Application

### Prerequisites

- Python 3.10+ with packages: `fastapi`, `uvicorn`, `scikit-learn`, `pandas`, `numpy`, `joblib`
- Node.js 18+ with dependencies installed (`npm install`)

### Start Backend

```bash
cd backend
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

Backend will be available at: http://127.0.0.1:8000

- API docs: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

### Start Frontend

```bash
npm run dev
```

Frontend will be available at: http://localhost:8080 (or the port shown in terminal)

## Testing the Integration

### 1. Test with Sample Data

Use these sample CBC values to test the system:

**Example: Iron Deficiency Anemia Pattern**

- Hemoglobin: 9.5 g/dL (LOW)
- MCV: 72 fL (LOW)
- MCH: 24 pg (LOW)
- MCHC: 30 g/dL (LOW)
- RBC: 4.8 ×10⁶/µL (NORMAL)
- Platelets: 300 ×10³/µL (NORMAL)

**Example: Normal CBC**

- WBC: 7.0 ×10³/µL
- RBC: 5.0 ×10⁶/µL
- Hemoglobin: 14.5 g/dL
- Hematocrit: 42 %
- MCV: 90 fL
- MCH: 30 pg
- MCHC: 34 g/dL
- Platelets: 250 ×10³/µL

### 2. Verify API Response

- Check browser DevTools Network tab
- Request should go to `http://localhost:8000/predict`
- Response status should be 200
- Response should contain predictions, ontology support, and recommendations

### 3. Check Error Handling

Test error scenarios:

- Backend offline: Should show error message about server not running
- Invalid input: Should show validation errors
- No values entered: Should prompt to enter at least one value

## Troubleshooting

### Backend Issues

**Error: "ModuleNotFoundError: No module named 'sklearn'"**

```bash
pip install scikit-learn
```

**Error: "Failed to load artifacts"**

- Ensure all `.joblib` and `.json` files are in the `backend/` directory
- Check file paths in `app.py` are correct

**Error: "CORS policy error"**

- Verify CORS middleware is configured with the correct frontend port
- Current configuration allows: localhost:5173, localhost:8080, and 127.0.0.1 variants

### Frontend Issues

**Error: "Failed to analyze CBC values"**

- Check if backend is running on port 8000
- Verify API_BASE_URL in browser console
- Check browser DevTools Network tab for CORS errors

**Error: "Cannot read properties of undefined"**

- Check that backend response structure matches TypeScript types
- Verify API response in Network tab

### Port Conflicts

**Backend port 8000 in use:**

```bash
# Use different port
uvicorn app:app --host 127.0.0.1 --port 8001 --reload
```

Then update `src/services/api.ts`:

```typescript
const API_BASE_URL = "http://localhost:8001";
```

**Frontend port 8080 in use:**
Vite will automatically try the next available port (8081, etc.)

## Environment Variables

Create a `.env` file in the frontend root directory (optional):

```
VITE_API_URL=http://localhost:8000
```

This allows easy configuration of the backend URL without code changes.

## API Documentation

Once the backend is running, visit:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Security Notes

⚠️ **Important**: This is a development configuration with:

- CORS enabled for localhost
- No authentication
- Suitable for development and testing only
- Do NOT deploy to production without proper security measures

For production deployment, implement:

- Authentication (JWT, OAuth)
- HTTPS/TLS
- Rate limiting
- Input sanitization
- Proper CORS configuration
- Logging and monitoring
- HIPAA compliance (if handling real patient data)

## Medical Disclaimer

This system is designed for **clinical decision support only** and must be used under the supervision of qualified healthcare professionals. It is not intended for standalone diagnostic use.

## Next Steps

1. ✅ Backend API with ML models
2. ✅ Frontend form and results display
3. ✅ API integration and error handling
4. 🔲 Export report functionality
5. 🔲 User authentication
6. 🔲 Results history
7. 🔲 PDF report generation
8. 🔲 Multi-language support
9. 🔲 Production deployment

## Support

For issues or questions:

1. Check console logs (browser and terminal)
2. Verify both servers are running
3. Test API health endpoint: http://localhost:8000/health
4. Review API documentation: http://localhost:8000/docs
