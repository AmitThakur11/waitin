import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sun } from 'lucide-react-native';

const PLATE_BLUE = '#1559C7';
const PLATE_BG = '#ECECEC';
const PLATE_RIM = '#9A9A9A';
const PLATE_LINE = '#2B2B2B';
const PLATE_TEXT = '#1A1A1A';

/**
 * EU/India-style number plate. Pass the registration string via `number`
 * (e.g. "DL 1A A2345") to render it dynamically.
 */
export function NumberPlate({ number = '', countryCode = 'IND', scale = 1 }) {
  return (
    <View style={[styles.rim, { borderRadius: 14 * scale, padding: 3 * scale }]}>
      <View
        style={[
          styles.plate,
          { borderRadius: 11 * scale, paddingVertical: 8 * scale, paddingHorizontal: 10 * scale },
        ]}>
        <View style={[styles.band, { paddingRight: 10 * scale, marginRight: 10 * scale }]}>
          <Sun size={14 * scale} color={PLATE_BLUE} strokeWidth={2} />
          <Text style={[styles.bandText, { fontSize: 11 * scale }]}>{countryCode}</Text>
        </View>
        <Text
          style={[styles.number, { fontSize: 26 * scale, letterSpacing: scale }]}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {number || '1234567890'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rim: {
    backgroundColor: PLATE_RIM,
    borderRadius: 14,
    padding: 3,
  },
  plate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PLATE_BG,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: PLATE_LINE,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  band: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    marginRight: 10,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#C4C4C4',
  },
  bandText: {
    color: PLATE_BLUE,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  number: {
    flex: 1,
    minWidth: 0,
    color: PLATE_TEXT,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
