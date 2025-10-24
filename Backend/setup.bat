@echo off
echo === Resume Screening API Setup ===
echo.

REM Check if Ollama is installed
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama is not installed.
    echo Please install Ollama from: https://ollama.ai/
    echo Then run: ollama pull qwen3:8b
    pause
    exit /b 1
)

echo ✅ Ollama is installed

REM Check if qwen3:8b model is available
ollama list | findstr /C:"qwen3:8b" >nul 2>&1
if %errorlevel% neq 0 (
    echo 📥 Pulling qwen3:8b model...
    ollama pull qwen3:8b
) else (
    echo ✅ qwen3:8b model is available
)

echo.
echo === Setting up Python environment ===

REM Check if virtual environment exists
if not exist "venv" (
    echo 📁 Creating virtual environment...
    python -m venv venv
)

echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

echo 📦 Installing Python dependencies...
pip install -r requirements.txt

echo.
echo === Configuration ===
echo 📝 Copying .env.example to .env...
copy .env.example .env

echo.
echo 🎉 Setup complete!
echo.
echo To start the API server:
echo 1. Activate virtual environment: venv\Scripts\activate
echo 2. Make sure Ollama is running: ollama serve
echo 3. Start the server: python main.py
echo.
echo API will be available at: http://localhost:8000
echo Interactive docs at: http://localhost:8000/docs

pause