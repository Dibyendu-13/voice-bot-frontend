import React, { useRef, useState } from "react";
import axios from "axios";
import { FaMicrophone, FaStop, FaPlay, FaPause } from "react-icons/fa";

function App() {
  const [recording, setRecording] = useState(false);
  const [responseAudio, setResponseAudio] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current.current = [];
        sendAudio(blob);
      };

      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      alert("Microphone access denied or not supported.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const sendAudio = async (blob) => {
    setLoading(true);
    setIsPlaying(false);

    // stop current playback if ongoing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");

    try {
      const res = await axios.post("https://voice-bot-backend-1.onrender.com/ask", formData);
      setQuestion(res.data.question);
      setAnswer(res.data.answer);

      const audioRes = await axios.get(`https://voice-bot-backend-1.onrender.com/${res.data.audio}`, {
        responseType: "blob",
      });

      const audioUrl = URL.createObjectURL(audioRes.data);
      setResponseAudio(audioUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong while processing your voice.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayback = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(responseAudio);
      audioRef.current.play();
      setIsPlaying(true);

      audioRef.current.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
    } else {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: "2rem" }}>🎙️ PDF-trained Voice Q&A Bot</h1>

      {recording ? (
        <button onClick={stopRecording} style={styles.stopBtn}>
          <FaStop /> Stop Recording
        </button>
      ) : (
        <button onClick={startRecording} style={styles.startBtn}>
          <FaMicrophone /> Start Speaking
        </button>
      )}

      {loading && <p style={{ marginTop: 20 }}>⏳ Processing your voice...</p>}

      {question && (
        <div style={styles.textBlock}>
          <p><strong>🧾 You asked:</strong> {question}</p>
          <p><strong>🤖 GPT says:</strong> {answer}</p>
        </div>
      )}

      {responseAudio && (
        <button onClick={handlePlayback} style={styles.playBtn}>
          {isPlaying ? (
            <>
              <FaPause /> Pause
            </>
          ) : (
            <>
              <FaPlay /> {audioRef.current ? "Resume" : "Play Answer"}
            </>
          )}
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "2rem",
    maxWidth: "700px",
    margin: "auto",
  },
  startBtn: {
    background: "#4CAF50",
    color: "#fff",
    fontSize: 18,
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  stopBtn: {
    background: "#f44336",
    color: "#fff",
    fontSize: 18,
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  playBtn: {
    marginTop: 20,
    background: "#333",
    color: "#fff",
    padding: "10px 20px",
    fontSize: 16,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
  },
  textBlock: {
    textAlign: "left",
    background: "#f9f9f9",
    padding: "1rem",
    borderRadius: "10px",
    marginTop: 30,
  },
};

export default App;
