import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import "./App.css";

const App = () => {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [aiResponse, setAiResponse] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [audio, setAudio] = useState(null);


    const API_URL = "https://voice-bot-backend-1.onrender.com/ask";

    useEffect(() => {
        if (!listening && transcript.trim()) {
            setIsProcessing(true);
            setAiResponse("");

            fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: transcript }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        setAiResponse(`Error: ${data.error}`);
                        setIsProcessing(false);
                        return;
                    }

                    setAiResponse(data.text);

                    const audioBlob = new Blob(
                        [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
                        { type: 'audio/mp3' }
                    );
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setAudio(audioUrl);
                })
                .catch(err => {
                    console.error("Fetch error:", err);
                    setAiResponse("Error connecting to the server.");
                    setIsProcessing(false);
                });
        }
    }, [listening, transcript]);

    // Only play audio from backend
    useEffect(() => {
        if (audio) {
            const audioElement = new Audio(audio);
            audioElement.play();
            setIsSpeaking(true);
            audioElement.onended = () => {
                setIsSpeaking(false);
                setIsProcessing(false);
                resetTranscript();
            };
        }
    }, [audio, resetTranscript]); // ✅ include resetTranscript


    if (!browserSupportsSpeechRecognition) {
        return <span className="error">Your browser does not support speech recognition.</span>;
    }

    return (
        <div className="container">
            <h1>🎙️ AI Voice Assistant</h1>
            <p className="subtitle">Speak and get real-time AI responses</p>

            <p className="status">
                Microphone: <span className={listening ? 'on' : 'off'}>{listening ? 'On' : 'Off'}</span>
            </p>

            <div className="buttons">
                <button className="start" onClick={() => SpeechRecognition.startListening({ continuous: true })} disabled={listening}>
                    Start
                </button>
                <button className="stop" onClick={SpeechRecognition.stopListening} disabled={!listening}>
                    Stop
                </button>
                <button className="reset" onClick={resetTranscript} disabled={!transcript}>
                    Reset
                </button>
            </div>

            <div className="response-box">
                <p><strong>User:</strong> {isSpeaking || isProcessing ? transcript : <i>Waiting for input...</i>}</p>
                <p><strong>AI:</strong> {isProcessing ? <i>Thinking...</i> : aiResponse || <i>Waiting for response...</i>}</p>
            </div>
        </div>
    );
};

export default App;
