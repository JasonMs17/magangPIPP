from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_session import Session
from chat import chat_bp
from chatbot import chat_model
from flask import Flask, request, jsonify, session
from config import supabase
from pydantic import BaseModel, ValidationError

app = Flask(__name__)

# Konfigurasi sesi
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = "supersecretkey"
app.config["SESSION_COOKIE_NAME"] = "session_id"
app.config["SESSION_COOKIE_HTTPONLY"] = False
app.config["SESSION_COOKIE_SECURE"] = False
app.config["SESSION_COOKIE_SAMESITE"] = "None"

Session(app)

app.register_blueprint(chat_bp)

# Konfigurasi CORS
CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173",
    "https://localhost:5173",
    "http://127.0.0.1:5173",
    "https://127.0.0.1:5173",
    "https://www.uni.id"
])


# Buat schema untuk validasi request body
class LoginRequest(BaseModel):
    npm: str
    password: str


class ChatRequest(BaseModel):
    question: str


chat_histories = {}


@app.route("/api/login", methods=["POST"])
def login():
    try:
        print("Incoming Request JSON:", request.json)  # ✅ Debug request body

        npm = request.json.get("npm")  # ✅ Benar, langsung ambil dari JSON
        print("NPMM", npm)  # ✅ Debug request body

        response = supabase.table("students").select("student_id").eq("student_id", npm).execute()
        print(response.data)

        if response.data:
            print("SUKSESS")  # ✅ Debug request body
            resp = jsonify({"success": True})
            resp.set_cookie("npm", npm, httponly=True, max_age=3600)  # Set cookie for 1 hour
            return resp
        else:
            return jsonify({"success": False, "error": "NPM tidak ditemukan"}), 400

    except ValidationError as e:
        return jsonify({"success": False, "error": "Format JSON tidak valid", "detail": e.errors()}), 400

    except Exception as e:
        print("GAGAL", e)
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/session", methods=["GET"])
def session_check():
    npm = request.cookies.get("npm")
    print("ADA GAK?", npm)
    if npm:
        return jsonify({"success": True, "npm": npm})
    return jsonify({"success": False}), 401


@app.route("/api/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({"success": True, "message": "Logout successful"}))
    response.set_cookie("npm", "", expires=0)  # Menghapus cookie npm
    return response


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
