from flask import Blueprint, request, jsonify
from datetime import datetime
from chatbot import chat_model
from config import supabase

chat_bp = Blueprint("chat", __name__)

chat_histories = {}

@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    npm = request.cookies.get("npm")
    if not npm:
        return jsonify({"detail": "Silakan login terlebih dahulu"}), 401

    try:
        user_input = request.json.get("question", "").strip().lower()
        if not user_input:
            return jsonify({"success": False, "error": "Pertanyaan tidak boleh kosong"}), 400

        # **Cek Jadwal Hari Ini**
        if user_input == "jadwal saya hari ini":
            return jsonify({"response": get_jadwal_hari_ini(npm)})

        # **Cek Daftar Tugas**
        elif user_input == "daftar tugas":
            return jsonify({"response": get_daftar_tugas(npm)})

        # **Jika Pertanyaan Umum ke Chatbot**
        else:
            return jsonify({"response": chat_with_model(npm, user_input)})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500


def get_jadwal_hari_ini(npm):
    hari_mapping = {
        "Monday": "Senin", "Tuesday": "Selasa", "Wednesday": "Rabu",
        "Thursday": "Kamis", "Friday": "Jumat", "Saturday": "Sabtu", "Sunday": "Minggu"
    }
    hari_ini = hari_mapping[datetime.today().strftime("%A")]

    schedule_ids = supabase.table("student_schedules").select("schedule_id").eq("student_id", npm).execute()
    if not schedule_ids.data:
        return "Tidak ada jadwal hari ini."

    schedule_id_list = [s["schedule_id"] for s in schedule_ids.data]
    jadwal_query = (
        supabase.table("schedules")
        .select("course_id, lecturer_id, start_time, end_time, room")
        .in_("schedule_id", schedule_id_list)
        .eq("day", hari_ini)
        .execute()
    )

    if not jadwal_query.data:
        return "Tidak ada jadwal hari ini."

    return "\n".join([
        f"Matkul: {j['course_id']}, Dosen: {j['lecturer_id']}, Jam: {j['start_time']} - {j['end_time']}, Ruangan: {j['room']}"
        for j in jadwal_query.data
    ])


def get_daftar_tugas(npm):
    assignment_ids = supabase.table("student_assignments").select("assignment_id").eq("student_id", npm).execute()
    if not assignment_ids.data:
        return "Tidak ada tugas saat ini."

    assignment_id_list = [a["assignment_id"] for a in assignment_ids.data]
    tugas_query = (
        supabase.table("assignments")
        .select("title, description, deadline")
        .in_("assignment_id", assignment_id_list)
        .execute()
    )

    if not tugas_query.data:
        return "Tidak ada tugas saat ini."

    return "\n".join([
        f"Tugas: {t['title']}, Deadline: {t['deadline']}\nDeskripsi: {t['description'] or '-'}"
        for t in tugas_query.data
    ])


def chat_with_model(npm, user_input):
    history = chat_histories.get(npm, [])
    conversation = history + [{"role": "user", "content": user_input}]

    response = chat_model.invoke(conversation)
    response_text = response.content if hasattr(response, 'content') else str(response)

    history.append({"role": "user", "content": user_input})
    history.append({"role": "assistant", "content": response_text})
    chat_histories[npm] = history

    return response_text
