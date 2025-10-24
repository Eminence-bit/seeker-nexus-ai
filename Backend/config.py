import os
from dotenv import load_dotenv

load_dotenv()

# Model configuration+9*50002/-;p.,ī
MODEL_PROVIDER = os.getenv("MODEL_PROVIDER", "openai")  # openai, openrouter, ollama
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

# Model names
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "microsoft/wizardlm-2-8x22b")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen3:8b")
