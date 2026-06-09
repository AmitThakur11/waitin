module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  // RN's preset ignores node_modules for transforms except a whitelist; add the
  // ESM-shipping packages we depend on so Jest can parse them.
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '(jest-)?react-native|@react-native(-community)?|' +
      '@react-navigation|react-native-screens|react-native-safe-area-context|@react-native-masked-view|' +
      'react-native-keychain|react-native-svg|lucide-react-native|@tanstack' +
      ')/)',
  ],
};
