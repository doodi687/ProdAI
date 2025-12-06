# ProdAI Backend

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file from the example:
```bash
cp .env.example .env
```

5. Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_api_key_here
```

6. Run the server:
```bash
python main.py
```

The server will start at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

- `POST /api/products/analyze` - Analyze a product URL
- `POST /api/products/pros-cons` - Get AI pros/cons
- `POST /api/products/analyze-full` - Full analysis
- `POST /api/compare/products` - Compare products
- `POST /api/chat/message` - Chat with AI
- `POST /api/recommendations/suggest` - Get recommendations
- `GET /health` - Health check
