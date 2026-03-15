# ARIA — AI Real-time Intelligent Assistant

ARIA is a voice-first AI personal assistant mobile app built using React Native and Expo. Users can interact via voice or text to get intelligent responses, trigger real device actions (such as making calls, setting alarms, sending messages), and access live data (weather, news, and web search). 

This project is built using a **100% free tier stack**, utilizing high-performance serverless functions and modern AI tooling.

## ✨ Features

- **Custom Identity**: ARIA has a fully custom identity and never reveals its underlying LLM.
- **Voice First**: Built-in Speech-to-Text (STT) and Text-to-Speech (TTS) using Web APIs.
- **Real Device Actions**: Execute native device actions directly from the chat:
  - Phone Calls & SMS (`make_call`, `send_sms`)
  - WhatsApp Messaging (`send_whatsapp`)
  - Alarms & Timers (`set_alarm`, `set_timer`)
  - Maps Navigation (`navigate_to`)
- **Live Data Integrations**:
  - Live Weather via OpenWeatherMap API
  - Real-time News via NewsAPI
  - Instant Web Search via DuckDuckGo
- **Conversation Memory**: Context-aware interactions using session history stored in MySQL.
- **Cross-Platform**: A single React Native codebase for both iOS and Android.

## 🛠️ Technology Stack

### Mobile Frontend
- **Framework**: React Native 0.74 + Expo SDK 51
- **Navigation**: React Navigation (Stack + Tabs)
- **Styling**: Custom Design System (Tailwind-inspired tokens)
- **Local Storage**: AsyncStorage
- **Voice APIs**: `expo-speech`, `expo-av`, Web Speech API

### Backend Server
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4.x
- **AI Integration**: Groq SDK (Llama 3.1 70B Versatile)
- **Database Driver**: `mysql2`
- **Security & Utilities**: `helmet`, `cors`, `express-rate-limit`, `morgan`

### Infrastructure & Hosting
- **LLM Provider**: Groq API (Incredibly fast inference)
- **Database**: Railway (MySQL)
- **Backend Hosting**: Render.com (Auto-deploy from GitHub)
- **Mobile Builds**: EAS Build (Expo Application Services)

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- Expo CLI (`npm install -g expo-cli`)
- A [Railway](https://railway.app/) account for the database
- API Keys from [Groq](https://console.groq.com/), [OpenWeatherMap](https://openweathermap.org/), and [NewsAPI](https://newsapi.org/)

### 1. Clone the repository
```bash
git clone https://github.com/Ayush-2005-ap/ARIA.git
cd ARIA
```

### 2. Setup Database
1. Create a MySQL database project in Railway.
2. Retrieve the `MYSQL_URL` connection string from Railway.
3. Establish a connection to the database and execute the `backend/db/schema.sql` code to create the necessary tables (`users`, `sessions`, `messages`, `tool_calls`).

### 3. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with the following variables:
```env
GROQ_API_KEY=your_groq_api_key
MYSQL_URL=your_railway_connection_string
OPENWEATHER_KEY=your_openweather_api_key
NEWS_API_KEY=your_news_api_key
PORT=10000
NODE_ENV=development
```
Start the backend development server:
```bash
npm run dev
```

### 4. Setup Frontend
Open a new terminal window:
```bash
cd aria-frontend
npm install
```
Start the Expo development server:
```bash
npx expo start
```
Scan the QR code with the **Expo Go** app on your physical device to test the app live.

## 📁 Repository Structure

```text
ARIA/
├── aria-frontend/          # React Native mobile app
│   ├── app/                # Expo Router screens
│   ├── components/         # Reusable UI elements (ChatBubble, MicButton)
│   ├── hooks/              # Custom hooks (Voice setup, Session management)
│   ├── constants/          # Theme tokens, colors, fonts
│   └── assets/             # Images, fonts, Lottie animations
│
├── backend/                # Node.js + Express API
│   ├── controllers/        # Core LLM prompt building & tool orchestration
│   ├── routes/             # Express API endpoints
│   ├── tools/              # Action scripts (Call, Weather, Alarm, etc.)
│   ├── db/                 # MySQL connection and schema files
│   └── server.js           # Server application entry point
│
└── README.md               # Project documentation
```

## 🧠 AI Pipeline & Architecture
1. **User Input:** Voice input is transcribed via Web Speech API or typed manually.
2. **Context Assembly:** The Express backend fetches the user's last 10 messages from MySQL.
3. **Groq Completion:** Context, along with available tools and the Custom ARIA Identity system prompt, is sent to Llama 3.1 70B on Groq.
4. **Tool Execution:** If the LLM determines a tool is needed, it replies with a JSON `tool_call`. The backend executes the corresponding JS function, fetching live APIs or instructing device routines.
5. **Response & TTS:** Final textual context is saved to the database, returned to the frontend, and optionally read aloud by device-native Text-To-Speech.

## 📄 License
This project is built for educational and portfolio purposes by Ayush Pandey, Bennett University.

---
*End-to-End Built with AI, from Vibe Coding to production.*
