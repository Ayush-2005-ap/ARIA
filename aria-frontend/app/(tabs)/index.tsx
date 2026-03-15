import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/theme';
import ChatBubble from '../../components/ChatBubble';
import MicButton from '../../components/MicButton';
import { sendMessage } from '../../services/api';

export default function HomeScreen() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi, I am ARIA. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Temporary mock IDs since we haven't hooked up auto-auth locally yet
  const TEMP_SESSION_ID = 2; 
  const TEMP_USER_ID = 2;

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsThinking(true);

    try {
        const result = await sendMessage(TEMP_SESSION_ID, userMessage, TEMP_USER_ID);
        setMessages(prev => [...prev, { role: 'assistant', content: result.reply }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't reach the server right now." }]);
    } finally {
        setIsThinking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={28} color={colors.textPrimary} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>ARIA</Text>
          <View style={styles.onlineDot} />
        </View>
        <Ionicons name="person-circle" size={28} color={colors.primary} />
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
            role={msg.role as 'user' | 'assistant'} 
            content={msg.content} 
          />
        ))}
        {isThinking && (
           <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
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
    paddingBottom: Platform.OS === 'ios' ? spacing.md : spacing.xl,
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
  }
});
