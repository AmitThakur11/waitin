/* eslint-env jest */
// Native modules that have no JS implementation under Jest.

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('@react-native-community/blur', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BlurView: ({ children, style }) => React.createElement(View, { style }, children),
  };
});
