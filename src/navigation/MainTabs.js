import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutGrid, Layers, QrCode, ShieldCheck, Settings } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { AssetsScreen } from '../screens/AssetsScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { PrivacyScreen } from '../screens/PrivacyScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors, shadow } from '../theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: LayoutGrid,
  Assets: Layers,
  Scan: QrCode,
  Privacy: ShieldCheck,
  Profile: Settings,
};

/** Dark, floating pill tab bar; the focused tab sits in a green circle. */
function FloatingTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]} pointerEvents="box-none">
      <View style={styles.bar}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const Icon = ICONS[route.name] ?? LayoutGrid;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <Pressable key={route.key} style={styles.tab} onPress={onPress} hitSlop={6}>
              <View style={[styles.circle, focused && styles.circleActive]}>
                <Icon
                  size={focused ? 23 : 22}
                  color={focused ? '#fff' : colors.tabInactive}
                  strokeWidth={focused ? 2.4 : 2}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Assets" component={AssetsScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Privacy" component={PrivacyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.tabBar,
    borderRadius: 36,
    paddingHorizontal: 12,
    height: 64,
    width: '90%',
    ...shadow,
    shadowOpacity: 0.18,
    shadowRadius: 22,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
});
