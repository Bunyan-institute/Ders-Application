import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme, useScaledFont } from '../hooks';
import { BorderRadius } from '../theme';

interface SeekableProgressBarProps {
  currentTime: number; // in seconds
  duration: number; // in seconds
  onSeek: (seconds: number) => void;
  disabled?: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const SeekableProgressBar: React.FC<SeekableProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const fonts = useScaledFont();

  const [trackWidth, setTrackWidth] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState(currentTime);

  const trackWidthRef = useRef(0);
  const durationRef = useRef(duration);
  durationRef.current = duration;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setTrackWidth(width);
    trackWidthRef.current = width;
  }, []);

  const calculateSecondsFromEvent = useCallback(
    (e: GestureResponderEvent): number => {
      const width = trackWidthRef.current;
      if (width <= 0 || durationRef.current <= 0) return 0;
      const touchX = e.nativeEvent.locationX;
      const ratio = Math.max(0, Math.min(1, touchX / width));
      return Math.round(ratio * durationRef.current);
    },
    []
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (e) => {
        setIsScrubbing(true);
        const target = calculateSecondsFromEvent(e);
        setScrubTime(target);
      },
      onPanResponderMove: (e) => {
        const target = calculateSecondsFromEvent(e);
        setScrubTime(target);
      },
      onPanResponderRelease: (e) => {
        const target = calculateSecondsFromEvent(e);
        setIsScrubbing(false);
        onSeek(target);
      },
      onPanResponderTerminate: () => {
        setIsScrubbing(false);
      },
    })
  ).current;

  const displayTime = isScrubbing ? scrubTime : currentTime;
  const progressPercent =
    duration > 0 ? Math.max(0, Math.min(100, (displayTime / duration) * 100)) : 0;

  return (
    <View style={styles.container}>
      {/* Floating Scrub Preview Tooltip */}
      {isScrubbing && (
        <View
          style={[
            styles.tooltip,
            {
              backgroundColor: colors.text,
              left: `${Math.max(5, Math.min(92, progressPercent))}%`,
            },
          ]}
        >
          <Text style={[styles.tooltipText, { color: colors.background }]}>
            {formatTime(scrubTime)}
          </Text>
        </View>
      )}

      {/* Touch-Friendly Track Container */}
      <View
        style={styles.touchArea}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        <View style={[styles.track, { backgroundColor: colors.progressTrack }]}>
          <View
            style={[
              styles.fill,
              {
                backgroundColor: colors.primary,
                width: `${progressPercent}%`,
              },
            ]}
          />
          <View
            style={[
              styles.knob,
              {
                backgroundColor: colors.accent,
                borderColor: colors.surface,
                left: `${Math.max(0, Math.min(98, progressPercent))}%`,
                transform: [{ scale: isScrubbing ? 1.25 : 1 }],
              },
            ]}
          />
        </View>
      </View>

      {/* Timestamps Row */}
      <View style={styles.timestampsRow}>
        <Text style={[styles.timeText, { color: colors.textSecondary, fontSize: fonts.xs }]}>
          {formatTime(displayTime)}
        </Text>
        <Text style={[styles.timeText, { color: colors.textTertiary, fontSize: fonts.xs }]}>
          {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 2,
    position: 'relative',
  },
  touchArea: {
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  track: {
    height: 4,
    borderRadius: BorderRadius.xs,
    position: 'relative',
    overflow: 'visible',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: BorderRadius.xs,
  },
  knob: {
    position: 'absolute',
    top: -5,
    marginLeft: -7,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  tooltip: {
    position: 'absolute',
    top: -24,
    transform: [{ translateX: -20 }],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    zIndex: 10,
  },
  tooltipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timestampsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  timeText: {
    fontVariant: ['tabular-nums'],
    fontWeight: '500',
  },
});
