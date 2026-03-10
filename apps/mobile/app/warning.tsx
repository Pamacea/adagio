// ============================================================================
// WARNING SCREEN - Album cover style warning page
// Design Metal/Brutal - ADAGIO
// ============================================================================

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { WarningIcon } from '../components';
import { Colors, Spacing, Typography, FontWeights } from '../theme';

export default function WarningScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleDismiss = () => {
    router.replace('/(tabs)');
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handleDismiss}
        activeOpacity={1}
      >
        {/* Background Pattern */}
        <View style={styles.backgroundPattern}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={i}
              style={[
               styles.patternLine,
                {
                  left: `${i * 5}%`,
                  transform: [{ rotate: `${i * 3}deg` }],
                },
              ]}
            />
          ))}
        </View>

        {/* Warning Content */}
        <View style={styles.content}>
          {/* Large Warning Icon */}
          <View style={styles.iconContainer}>
            <WarningIcon size={64} color={Colors.danger} />
          </View>

          {/* Warning Title */}
          <Text style={styles.title}>ATTENTION</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>VOLUME MAXIMAL</Text>

          {/* Warning Message */}
          <View style={styles.messageBox}>
            <Text style={styles.message}>
              L'écoute prolongée à volume élevé peut endommager votre système auditif.
            </Text>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerTitle}>AVERTISSEMENT</Text>
            <Text style={styles.disclaimerText}>
              ADAGIO décline toute responsabilité en cas de dommage auditif résultant d'une
              utilisation irresponsable de cette application.
            </Text>
          </View>

          {/* Tap to Continue */}
          <View style={styles.tapContainer}>
            <View style={styles.tapIndicator} />
            <Text style={styles.tapText}>TAPPOEZ N'IMPORTE OÙ POUR CONTINUER</Text>
            <Text style={styles.tapSubtext}>FERMETURE AUTOMATIQUE DANS 3 SECONDES</Text>
          </View>
        </View>

        {/* Bottom Branding */}
        <View style={styles.branding}>
          <Text style={styles.brandText}>ADAGIO</Text>
          <Text style={styles.brandSubtext}>Music Theory App</Text>
        </View>

        {/* Border Frame */}
        <View style={styles.frame} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  patternLine: {
    position: 'absolute',
    top: -50,
    width: 1,
    height: '120%',
    backgroundColor: Colors.gray600,
  },
  content: {
    zIndex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.titleXXL * 2,
    fontWeight: FontWeights.black,
    color: Colors.danger,
    textTransform: 'uppercase',
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: Spacing.md,
    textShadowColor: Colors.danger,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: Typography.titleLG,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  messageBox: {
    backgroundColor: Colors.gray900,
    borderWidth: 2,
    borderColor: Colors.danger,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  message: {
    fontSize: Typography.bodyMD,
    color: Colors.gray300,
    textAlign: 'center',
    lineHeight: 22,
  },
  disclaimerBox: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.gray700,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  disclaimerTitle: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: Typography.bodySM,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 18,
  },
  tapContainer: {
    alignItems: 'center',
  },
  tapIndicator: {
    width: 8,
    height: 8,
    backgroundColor: Colors.danger,
    borderRadius: 4,
    marginBottom: Spacing.sm,
  },
  tapText: {
    fontSize: Typography.labelLG,
    fontWeight: FontWeights.bold,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },
  tapSubtext: {
    fontSize: Typography.bodyXS,
    color: Colors.gray700,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  branding: {
    position: 'absolute',
    bottom: Spacing.xl,
    alignItems: 'center',
  },
  brandText: {
    fontSize: Typography.titleLG,
    fontWeight: FontWeights.black,
    color: Colors.gray700,
    textTransform: 'uppercase',
    letterSpacing: 8,
  },
  brandSubtext: {
    fontSize: Typography.bodyXS,
    color: Colors.gray800,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  frame: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.gray800,
    pointerEvents: 'none',
  },
});
