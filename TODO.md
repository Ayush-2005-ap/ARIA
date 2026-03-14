# ARIA Developer To-Do List

This document breaks down the end-to-end development of the ARIA AI Real-time Intelligent Assistant into actionable steps, categorized by feature and aligned with the project's 8-week timeline.

## 1. Project Foundation (Week 1-2)
- [x] **Repository Setup**
  - [x] Initialize Git repository.
  - [x] Initialize React Native frontend using `npx create-expo-app aria-frontend`.
  - [x] Initialize Node.js backend using `npm init -y` inside `backend/`.
- [x] **Frontend Dependencies**
  - [x] Install React Navigation (`@react-navigation/native`, `@react-navigation/stack`).
  - [x] Install Expo modules (`expo-speech`, `expo-av`, `expo-notifications`, `expo-linking`, `expo-constants`, `expo-font`, `@expo-google-fonts/inter`).
  - [x] Install utility libraries (`axios`, `@react-native-async-storage/async-storage`, `react-native-reanimated`, `lottie-react-native`).
- [x] **Backend Dependencies**
  - [x] Install Express and middlewares (`express`, `cors`, `helmet`, `morgan`, `express-rate-limit`).
  - [x] Install integration libraries (`groq-sdk`, `mysql2`, `dotenv`, `axios`).

## 2. Database & Data Layer
- [ ] **PlanetScale Setup**
  - [ ] Create a database named `aria`.
  - [ ] Establish `dev` and `main` branches.
- [x] **Schema Implementation**
  - [x] Create `users` table (id, name, device_id, preferred_lang, created_at).
  - [x] Create `sessions` table (id, user_id, title, created_at, last_active).
  - [x] Create `messages` table (id, session_id, role, content, tokens_used, created_at).
  - [x] Create `tool_calls` table (id, message_id, tool_name, input_params, result, success, executed_at).
- [x] **Database Connection**
  - [x] Configure `backend/db/connection.js` using `mysql2` and PlanetScale connect string.

## 3. Core Chat Backend & LLM Integration
- [ ] **API Endpoint Configuration**
  - [ ] Create `/api/users` endpoint to register new devices.
  - [ ] Create `/api/sessions` endpoints (GET, POST, DELETE) for chat history management.
  - [ ] Create `/api/chat` POST endpoint for message handling.
- [ ] **Groq Llama 3.1 Integration**
  - [ ] Setup `groq-sdk` in `chatController.js`.
  - [ ] Define the ARIA System Prompt (custom identity: built by Ayush Pandey).
  - [ ] Fetch the last 10 messages from MySQL as context for every Groq request.
  - [ ] Implement message persistence mapping Groq replies and user inputs into MySQL.

## 4. Mobile Chat UI Foundation
- [ ] **Theme & Design Tokens**
  - [ ] Configure `constants/theme.js` using Stitch-extracted exact colors (Dark/Light modes).
  - [ ] Import and apply `Inter` font family defaults.
- [ ] **Chat Interface Screens**
  - [ ] Develop `HomeScreen.jsx` basic layout (Header, list area, input bar).
  - [ ] Create `<ChatBubble />` component for User and ARIA messages.
  - [ ] Parse and display static backend responses locally.
- [ ] **Session & Message State**
  - [ ] Implement `useSession.js` hook for fetching session history formatting.

## 5. Voice Pipeline (Week 3)
- [ ] **Text-To-Speech (TTS)**
  - [ ] Develop `hooks/useTextToSpeech.js` wrapping `expo-speech`.
  - [ ] Trigger TTS automatically upon successfully receiving an AI response.
- [ ] **Speech-To-Text (STT)**
  - [ ] Develop `hooks/useSpeechToText.js` covering the Web Speech API/`expo-av`.
  - [ ] Configure microphone permissions in Expo.
- [ ] **Voice Listening UI**
  - [ ] Build `<MicButton />` hero component with bounding glows and 2s pulse animation.
  - [ ] Build the Full-Screen Voice overlay displaying transcript and intent.
  - [ ] Develop `<VoiceWaveform />` with 7 dynamically animating gradient bars `(#22D3EE → #8B5CF6)`.

## 6. Tool Logic & Integration (Week 5-6)
- [ ] **Backend Tool Dispatcher**
  - [ ] Configure `tools/index.js` tool router.
  - [ ] Send defined `tools` JSON schema to Groq.
- [ ] **Native Action Tools (Expo Linking)**
  - [ ] Implement `make_call` (Phone dialer deep link).
  - [ ] Implement `send_whatsapp` (WhatsApp URL deep link).
  - [ ] Implement `send_sms` (SMS messaging integration).
- [ ] **Scheduled App Actions Tools**
  - [ ] Implement `set_timer` (Trigger frontend countdown).
  - [ ] Implement `set_alarm` (Trigger Expo Notifications schedule).
- [ ] **Third-Party API Tools**
  - [ ] Implement `get_weather` via OpenWeatherMap API.
  - [ ] Implement `web_search` via DuckDuckGo Instant Answer API.
  - [ ] Implement `get_news` via NewsAPI.org.
- [ ] **Tool Result Presentation**
  - [ ] Develop flexible `<ToolResultCard />` component for chat inline renders.
  - [ ] Save tool JSON returns into the `tool_calls` MySQL logging table.

## 7. Memory, Identity & App Navigation (Week 4)
- [ ] **Navigation Shell**
  - [ ] Set up Bottom Tab Navigation (History | Chat | Settings).
- [ ] **Onboarding Flow**
  - [ ] Build 3-slide Onboarding carousel (Meet ARIA, Talk Naturally, Do Things Faster).
  - [ ] Integrate user identity save and Lottie animations.
- [ ] **History Screen**
  - [ ] Implement `SessionList.jsx` rendering grouped past conversations.
- [ ] **Settings Screen**
  - [ ] Develop Dark/Light mode toggle mechanism linked to AsyncStorage.
  - [ ] Add Voice Output toggle and Chat clearing functionality.

## 8. App Polish & Logo System (Week 7)
- [ ] **Animations & Feedback**
  - [ ] Implement chat message slide-in animations.
  - [ ] Implement "Thinking..." skeleton shimmers placeholder.
- [ ] **Logo System**
  - [ ] Add the Atomiq-Inspired ARIA sharp A-mark into UI/Assets.
  - [ ] Generate and register standard OS application Icon (`1024x1024px PNG`).
  - [ ] Generate Splash screen with dark background constraint (`#0A0A0C`).
- [ ] **Error Handling & Limits**
  - [ ] Configure user-friendly fallback components for mic rejections.
  - [ ] Setup rate limits (`middleware/rateLimit.js`) allowing 20 reqs/hr.

## 9. Deployment Pipeline (Week 8)
- [ ] **Backend Production Rollout**
  - [ ] Ensure API Keys exist (Groq, MySQL, Weather, News).
  - [ ] Push Repo and deploy Node.js stack on Render.com.
  - [ ] Verify Render URL connectivity mapping `services/api.js`.
- [ ] **Mobile App Distribution**
  - [ ] Use `eas-cli` to construct a preview APK for device installation testing.
  - [ ] Setup production Play Store listings, Privacy policies, and App Store graphics.
  - [ ] Generate `eas build --platform android --profile production` `.aab` structure for upload.
