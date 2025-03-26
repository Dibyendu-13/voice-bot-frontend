import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import "./App.css";


const socket = io("https://voice-bot13.netlify.app"); // Connect to WebSocket server

const App = () => {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [aiResponse, setAiResponse] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [audio, setAudio] = useState(null); // State to store the audio response

    useEffect(() => {
        if (!listening && transcript.trim()) {
            setIsProcessing(true); // Show thinking status
            setAiResponse(""); // Clear previous AI response
            socket.emit("userMessage", transcript);
        }
    }, [listening, transcript]);

    useEffect(() => {
        // Function to handle speaking text
        const speakText = (text) => {
            if (!text) return;

            const synth = window.speechSynthesis;
            synth.cancel(); // Stop any ongoing speech

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => {
                setIsSpeaking(false);
                resetTranscript(); // Clear user input **after** AI finishes speaking
                setAiResponse(""); // Clear AI response
            };

            synth.speak(utterance);
        };

        socket.on("aiResponse", (data) => {
            if (data === "END_OF_STREAM") {
                setIsProcessing(false);
            } else if (data.text) {
                setAiResponse(data.text); // Store the full response (text)
                speakText(data.text); // Speak the full response
            } else if (data.audio) {
                // Handle audio response
                const audioBlob = new Blob([data.audio], { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudio(audioUrl); // Store the audio URL
            }
        });

        return () => {
            socket.off("aiResponse");
        };
    }, [resetTranscript]); // Empty dependency array since we handle all dependencies inside useEffect

    useEffect(() => {
        // Function to handle playing audio response
        const playAudioResponse = () => {
            if (audio) {
                const audioElement = new Audio(audio);
                audioElement.play(); // Play the received audio response
                audioElement.onended = () => {
                    setIsSpeaking(false); // Reset speaking state when audio finishes
                };
            }
        };

        if (audio) {
            playAudioResponse(); // Automatically play audio when it's received
        }
    }, [audio]); // Dependency array contains 'audio' to trigger effect when audio URL changes

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
