#!/bin/bash

echo "=== Resume Screening API Setup ==="
echo ""

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed."
    echo "Please install Ollama from: https://ollama.ai/"
    echo "Then run: ollama pull qwen3:8b"
    exit 1
fi

echo "✅ Ollama is installed"

# Check if qwen3:8b model is available
if ! ollama list | grep -q "qwen3:8b"; then
    echo "📥 Pulling qwen3:8b model..."
    ollama pull qwen3:8b
else
    echo "✅ qwen3:8b model is available"
fi

echo ""
echo "=== Setting up Python environment ==="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📁 Creating virtual environment..."
    python -m venv venv
fi

echo "🔄 Activating virtual environment..."
source venv/bin/activate  # On Windows: venv\Scripts\activate

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo ""
echo "=== Configuration ==="
echo "📝 Copying .env.example to .env..."
cp .env.example .env

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the API server:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Make sure Ollama is running: ollama serve"
echo "3. Start the server: python main.py"
echo ""
echo "API will be available at: http://localhost:8000"
echo "Interactive docs at: http://localhost:8000/docs"