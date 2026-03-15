import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius } from '../constants/theme';
import ChatBubble from '../components/ChatBubble';
import MicButton from '../components/MicButton';
import { sendMessage, getUserId, createSession } from '../services/api';

export default function HomeScreen() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  // Auth State
  const [userName, setUserName] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tempNameInput, setTempNameInput] = useState('');
  
  const [userId, setUserId] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const storedName = await AsyncStorage.getItem('aria_userName');
    const storedDeviceId = await AsyncStorage.getItem('aria_deviceId');
    
    if (storedName && storedDeviceId) {
      setUserName(storedName);
      initializeSession(storedDeviceId);
    } else {
      setShowOnboarding(true);
    }
  };

  const handleCreateUser = async () => {
    if (!tempNameInput.trim()) {
      Alert.alert("Required", "Please tell ARIA your name.");
      return;
    }
    
    const newDeviceId = 'device-' + Date.now();
    await AsyncStorage.setItem('aria_userName', tempNameInput.trim());
    await AsyncStorage.setItem('aria_deviceId', newDeviceId);
    
    setUserName(tempNameInput.trim());
    setShowOnboarding(false);
    
    initializeSession(newDeviceId);
  };

  const initializeSession = async (deviceId: string) => {
    try {
      const uId = await getUserId(deviceId);
      setUserId(uId);
      const sId = await createSession(uId);
      setSessionId(sId);
      
      const storedName = await AsyncStorage.getItem('aria_userName') || 'User';
      setMessages([{ role: 'assistant', content: `Hi ${storedName}, I am ARIA. How can I help you today?` }]);
    } catch (e) {
      console.log('Failed to init session', e);
      setMessages([{ role: 'assistant', content: 'Could not connect to ARIA servers.' }]);
    }
  };

  const handleComingSoon = () => {
    Alert.alert("Coming Soon", "This feature is currently under active development!");
  };

  const handleSend = async () => {
    if (!inputText.trim() || !sessionId || !userId) return;

    const userMessage = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsThinking(true);

    try {
        const result = await sendMessage(sessionId, userMessage, userId);
        let replyText = result.reply;
        
        // Hide ugly raw JSON if it tries to execute a tool natively
        if (replyText.includes('"tool_call"')) {
            replyText = "Executing task on your device natively...";
        }

        setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't reach the server right now." }]);
    } finally {
        setIsThinking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Onboarding Name Modal Component */}
      <Modal visible={showOnboarding} animationType="slide" transparent={false}>
        <View style={styles.onboardingContainer}>
          <Text style={styles.onboardingTitle}>Welcome to ARIA</Text>
          <Text style={styles.onboardingSubtitle}>Your personal intelligent assistant.</Text>
          
          <TextInput
              style={styles.onboardingInput}
              placeholder="What should I call you?"
              placeholderTextColor={colors.textMuted}
              value={tempNameInput}
              onChangeText={setTempNameInput}
              autoCapitalize="words"
          />
          
          <TouchableOpacity style={styles.onboardingBtn} onPress={handleCreateUser}>
            <Text style={styles.onboardingBtnText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleComingSoon}>
          <Ionicons name="menu" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>ARIA</Text>
          <View style={styles.onlineDot} />
        </View>
        
        <TouchableOpacity onPress={handleComingSoon}>
          <Ionicons name="settings-sharp" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={{ padding: spacing.md }}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <ChatBubble 
            key={index} 
            role={msg.role} 
            content={msg.content} 
          />
        ))}
        {isThinking && (
           <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 20}}>
             <View style={{width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, justifyContent:'center', alignItems:'center', marginRight: 10}}>
                <Text style={{color: '#FFF', fontWeight: 'bold'}}>A</Text>
             </View>
             <Text style={{color: colors.textSecondary}}>Aria is thinking...</Text>
           </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView edges={['bottom']} style={{backgroundColor: colors.bgDark}}>
            <View style={styles.bottomContainer}>
            <View style={styles.inputWrapper}>
                <TextInput
                style={styles.input}
                placeholder="Ask ARIA anything..."
                placeholderTextColor={colors.textMuted}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
                />
                {inputText.length > 0 && (
                    <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Ionicons name="send" size={20} color={colors.primary} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={{ marginLeft: spacing.md }}>
                <MicButton 
                isRecording={isRecording} 
                onPressIn={() => setIsRecording(true)}
                onPressOut={() => setIsRecording(false)}
                />
            </View>
            </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginLeft: 6,
  },
  chatArea: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.bgGlass,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    height: '100%',
  },
  sendButton: {
    padding: 8,
  },
  onboardingContainer: {
    flex: 1,
    backgroundColor: colors.bgDark,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  onboardingTitle: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  onboardingSubtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: spacing.xl,
  },
  onboardingInput: {
    backgroundColor: colors.bgGlassHover,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: radius.md,
    color: colors.textPrimary,
    padding: spacing.md,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  onboardingBtn: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  onboardingBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  }
});
