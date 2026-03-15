import axios from 'axios';
import { Platform } from 'react-native';

// For Android Emulators, localhost is 10.0.2.2. For iOS/Physical devices usually wifi IP or localhost 
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:10000/api' : 'http://localhost:10000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, 
});

export const getUserId = async (deviceId: string) => {
    const res = await api.post('/users', { device_id: deviceId, name: 'User' });
    return res.data.user_id;
};

export const createSession = async (userId: number) => {
    const res = await api.post('/sessions', { user_id: userId });
    return res.data.session_id;
};

export const sendMessage = async (sessionId: number, message: string, userId: number) => {
    const res = await api.post('/chat', {
        session_id: sessionId,
        user_id: userId,
        message: message,
    });
    return res.data;
};

export const getSessionMessages = async (sessionId: number) => {
    const res = await api.get(`/messages/${sessionId}`);
    return res.data;
};

export default api;
