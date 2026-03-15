import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import { colors, radius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface MicButtonProps {
  isRecording: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
}

export default function MicButton({ isRecording, onPressIn, onPressOut }: MicButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Pulse animation when idle
  useEffect(() => {
    if (!isRecording) {
        scale.value = withRepeat(
            withSequence(
              withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
              withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1, // infinite
            true // reverse
        );
        opacity.value = withRepeat(
            withSequence(
              withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
              withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    } else {
        // Stop pulse and grow slightly when recording
        scale.value = withTiming(1.1, { duration: 200 });
        opacity.value = withTiming(1, { duration: 200 });
    }
  }, [isRecording]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glow, animatedStyle, isRecording && styles.glowActive]} />
      <TouchableOpacity 
        style={styles.button}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.8}
      >
        <Ionicons name="mic" size={28} color="#FFF" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  glow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.primaryGlow,
    zIndex: 1,
  },
  glowActive: {
    backgroundColor: colors.primaryGlowHi,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 10,
  },
  icon: {
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  }
});
