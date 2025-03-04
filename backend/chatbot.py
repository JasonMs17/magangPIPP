from langchain_google_genai import ChatGoogleGenerativeAI
from config import GOOGLE_API_KEY

# 🔹 Model Chatbot dengan Gemini
chat_model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=GOOGLE_API_KEY)
