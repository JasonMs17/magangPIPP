import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [userNPM, setUserNPM] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const chatBoxRef = useRef<HTMLDivElement>(null); // Ref untuk chat-box

  // Scroll ke bawah setiap kali messages berubah
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Cek session saat komponen dimuat
  useEffect(() => {
  axios
    .get("api/session", { withCredentials: true })
    .then((response) => {
      setUserNPM(response.data.npm);
      setMessages((prev) => {
        if (!prev.some(msg => msg.text.includes(`NPM: ${response.data.npm}`))) {
          return [...prev, { text: `NPM: ${response.data.npm}`, isUser: false }];
        }
        return prev;
      });
    })
    .catch(() => {
      setMessages([{ text: "Silakan login untuk menggunakan chatbot.", isUser: false }]);
    });
}, []);

    const handleTemplateClick = (text: string) => {
      setInput(text);
      sendMessage(text);
    };


  // Fungsi untuk mengirim pesan
const sendMessage = async (messageText?: string, customData = {}) => {
  const text = messageText || input;
  if (!text.trim()) return;

  setMessages((prev) => [...prev, { text, isUser: true }]);
  setInput("");
  setIsTyping(true);

  try {
    const response = await axios.post(
      "api/chat",
      { question: text, ...customData },
      { withCredentials: true }
    );
    setMessages((prev) => [...prev, { text: response.data.response, isUser: false }]);
  } catch {
    setMessages((prev) => [...prev, { text: "Terjadi kesalahan.", isUser: false }]);
  } finally {
    setIsTyping(false);
  }
};


  // Fungsi untuk logout
  const logout = async () => {
    try {
      await axios.post("api/logout", {}, { withCredentials: true });
      setUserNPM(null);
      alert("Logout berhasil!");
      navigate("/login");
    } catch {
      alert("Logout gagal!");
    }
  };

  return (
    <div>
      {/* Tombol untuk membuka/menutup chatbox */}
      <button className="chat-button" onClick={() => setIsOpen(!isOpen)}>
        Chat
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div className={`chat-container ${isOpen ? "open" : "closed"}`}>
          {/* Header chatbox */}
          <div className="chat-header">
            Chatbot Asisten Akademik
            <button className="close-button" onClick={() => setIsOpen(false)}>
              &#10005;
            </button>
          </div>

          {/* Area pesan */}
          <div className="chat-box" ref={chatBoxRef}>
          {/* Template Questions */}


          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.isUser ? "user-message" : "ai-message"}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && <div className="typing-indicator">Typing...</div>}
        </div>


<div className="template-questions">
  <button onClick={() => handleTemplateClick("Jadwal saya hari ini")}>
    Jadwal saya hari ini
  </button>
  <button onClick={() => handleTemplateClick("Daftar tugas")}>
    Daftar tugas
  </button>
</div>

          {/* Input area */}
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Masukkan pertanyaan..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()} // Kirim pesan saat tekan Enter
            />
            <button onClick={sendMessage}>Kirim</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;