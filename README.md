# 🎙️ AI Voice Assistant  

This is a **React-based AI Voice Assistant** that allows users to interact with an AI agent using speech recognition and receive responses in text and speech format. The assistant connects to a WebSocket backend for real-time communication.

---

## **🚀 Features**
- **Real-time Speech Recognition**: Uses the Web Speech API for recognizing user input.
- **AI-Powered Responses**: Sends user queries to the AI backend and receives responses.
- **Text-to-Speech (TTS)**: Converts AI responses into speech for a natural conversation flow.
- **Audio Response Handling**: Plays audio responses from the backend if available.
- **WebSocket Communication**: Uses `socket.io` for real-time interactions.

---

## **🛠️ Tech Stack**
- **Frontend**: React.js
- **Speech Recognition**: [`react-speech-recognition`](https://www.npmjs.com/package/react-speech-recognition)
- **Text-to-Speech (TTS)**: Web Speech API
- **WebSocket Communication**: `socket.io-client`
- **Styling**: CSS

---

## **📌 Prerequisites**
Before running the project, ensure you have:
- **Node.js** (v14 or later)
- **npm** (v6 or later)

---

## **📥 Installation**
1. **Clone the repository**  
   ```sh
   git clone https://github.com/Dibyendu-13/voice-bot-frontend.git
   cd voice-bot-frontend
   ```

2. **Install dependencies**  
   ```sh
   npm install
   ```

---

## **▶️ Usage**
1. **Start the development server**  
   ```sh
   npm start
   ```
   This will launch the app in your default browser at `http://localhost:3000`.

2. **Interact with the assistant**:
   - Click **Start** to begin voice recognition.
   - Speak your query.
   - The AI will respond with both text and voice.
   - Click **Stop** to pause recognition.
   - Click **Reset** to clear input.

---

## **📝 Code Explanation**
### **1. WebSocket Connection**
The app connects to the WebSocket backend at:
```js
const socket = io("http://localhost:5001");
```
It listens for AI responses and manages real-time communication.

### **2. Speech Recognition**
- `react-speech-recognition` handles voice input.
- The transcript is sent to the backend when recognition stops.

### **3. AI Response Handling**
- If the response is **text**, it's displayed and spoken using Web Speech API.
- If the response is **audio**, it is played automatically.

### **4. Text-to-Speech (TTS)**
- Uses `speechSynthesis` to read AI responses aloud.
- Stops any ongoing speech before speaking a new response.

### **5. UI Components**
- **Start, Stop, Reset buttons** to control voice input.
- **Status display** for mic activity.
- **Response box** to show user input and AI replies.

---

## **🎨 UI Overview**
### **Home Page**
```
+---------------------------------+
| 🎙️ AI Voice Assistant         |
| Speak and get real-time responses |
+---------------------------------+
| Microphone: [On/Off]            |
| [Start]  [Stop]  [Reset]        |
+---------------------------------+
| User: (Your Speech Input)       |
| AI: (AI Response)               |
+---------------------------------+
```

---

## **🔧 Customization**
### **Change AI Backend URL**
Modify the WebSocket URL in `App.js`:
```js
const socket = io("YOUR_BACKEND_URL");
```

### **Modify Speech Settings**
Edit `speakText` function in `App.js`:
```js
utterance.lang = 'en-US'; // Change language
utterance.rate = 1;        // Adjust speed (0.5 - 2)
```

---

## **🐞 Troubleshooting**
| Issue | Solution |
|--------|---------|
| Microphone not working | Ensure mic permissions are enabled in your browser. |
| AI not responding | Check the WebSocket server URL. |
| No voice output | Ensure system volume is up and TTS is enabled. |

---

## **📜 License**
This project is licensed under the MIT License.

---

## **🤝 Contributing**
1. Fork the repository.
2. Create a new branch (`feature-branch`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a Pull Request.

---

## **📬 Contact**
For queries or suggestions, feel free to reach out! 🚀
