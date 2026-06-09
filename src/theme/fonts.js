import React from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';

/**
 * Inter is shipped as one static .ttf per weight, so React Native's numeric
 * `fontWeight` won't pick the right file on its own. We map each weight to its
 * Inter PostScript name (which matches both the iOS font name and the Android
 * asset file name) and inject it globally — every <Text>/<TextInput> in the app
 * renders in Inter without touching individual styles.
 */
export const fonts = {
  thin: 'Inter-Thin',
  extraLight: 'Inter-ExtraLight',
  light: 'Inter-Light',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  extraBold: 'Inter-ExtraBold',
  black: 'Inter-Black',
};

const WEIGHT_TO_FAMILY = {
  '100': fonts.thin,
  '200': fonts.extraLight,
  '300': fonts.light,
  '400': fonts.regular,
  '500': fonts.medium,
  '600': fonts.semiBold,
  '700': fonts.bold,
  '800': fonts.extraBold,
  '900': fonts.black,
  normal: fonts.regular,
  bold: fonts.bold,
};

function withInter(style) {
  const flat = StyleSheet.flatten(style) || {};
  // Respect an explicitly-set custom fontFamily; otherwise pick by weight.
  const family = flat.fontFamily || WEIGHT_TO_FAMILY[String(flat.fontWeight ?? '400')] || fonts.regular;
  // `fontWeight: undefined` avoids the OS faux-bolding an already-bold Inter file.
  return [style, { fontFamily: family, fontWeight: undefined }];
}

function patch(Component) {
  if (!Component || Component.__interPatched) return;
  if (typeof Component.render === 'function') {
    const original = Component.render;
    Component.render = function (...args) {
      const element = original.apply(this, args);
      return React.cloneElement(element, { style: withInter(element.props.style) });
    };
  } else if (Component.prototype && typeof Component.prototype.render === 'function') {
    const original = Component.prototype.render;
    Component.prototype.render = function () {
      const element = original.call(this);
      return React.cloneElement(element, { style: withInter(element.props.style) });
    };
  }
  Component.__interPatched = true;
}

patch(Text);
patch(TextInput);
