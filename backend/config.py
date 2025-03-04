import os
import google.generativeai as genai
from dotenv import load_dotenv
from supabase import create_client, Client

# 🔹 Load variabel dari file .env
load_dotenv()

# 🔹 API Key Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# 🔹 Koneksi ke Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
