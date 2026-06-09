import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutGrid, Layers, QrCode, ShieldCheck, Settings } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { AssetsScreen } from '../screens/AssetsScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { PrivacyScreen } from '../screens/PrivacyScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: LayoutGrid,
  Assets: Layers,
  Scan: QrCode,
  Privacy: ShieldCheck,
  Profile: Settings,
};

const LABELS = {
  Home: 'Home',
  Assets: 'Tags',
  Scan: 'Scan',
  Privacy: 'Privacy',
  Profile: 'Profile',
};

// The center route renders as the elevated floating action button.
const CENTER_ROUTE = 'Scan';

const BAR_HEIGHT = 66;
const CORNER = 28;
const FAB_SIZE = 60;
const DIP_HALF = 54; // half-width of the dip opening (wide => gap around FAB)
const DIP_DEPTH = 30; // how far the dip drops from the top edge

// Rounded-rect bar with a smooth concave dip at the top center. The dip's
// bezier shoulders start tangent to the top edge, so the corners stay rounded
// (no sharp points) while the FAB nests into the notch with a gap around it.
function cradlePath(w, h) {
  const cx = w / 2;
  const d = DIP_DEPTH;
  const o = DIP_HALF;
  return [
    `M 0 ${CORNER}`,
    `Q 0 0 ${CORNER} 0`,
    `L ${cx - o} 0`,
    `C ${cx - o * 0.5} 0 ${cx - o * 0.5} ${d} ${cx} ${d}`,
    `C ${cx + o * 0.5} ${d} ${cx + o * 0.5} 0 ${cx + o} 0`,
    `L ${w - CORNER} 0`,
    `Q ${w} 0 ${w} ${CORNER}`,
    `L ${w} ${h - CORNER}`,
    `Q ${w} ${h} ${w - CORNER} ${h}`,
    `L ${CORNER} ${h}`,
    `Q 0 ${h} 0 ${h - CORNER}`,
    'Z',
  ].join(' ');
}

/** Dark bar with a center cradle notch and an elevated FAB nested into it. */
function FloatingTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);

  const press = (route, focused) => () => {
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <View style={styles.bar} onLayout={e => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 ? (
          <Svg width={width} height={BAR_HEIGHT} style={StyleSheet.absoluteFill}>
            <Path d={cradlePath(width, BAR_HEIGHT)} fill={colors.tabBar} />
          </Svg>
        ) : null}

        <View style={styles.row}>
          {state.routes.map((route, i) => {
            const focused = state.index === i;
            const Icon = ICONS[route.name] ?? LayoutGrid;

            if (route.name === CENTER_ROUTE) {
              return (
                <View key={route.key} style={styles.fabSlot}>
                  <Pressable style={styles.fab} onPress={press(route, focused)} hitSlop={8}>
                    <Icon size={26} color="#000" strokeWidth={2.4} />
                  </Pressable>
                </View>
              );
            }

            return (
              <Pressable key={route.key} style={styles.tab} onPress={press(route, focused)} hitSlop={6}>
                <Icon
                  size={22}
                  color={focused ? '#fff' : colors.tabInactive}
                  strokeWidth={focused ? 2.4 : 2}
                />
                <Text style={[styles.label, focused && styles.labelActive]}>
                  {LABELS[route.name] ?? route.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
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
    width: '92%',
    height: BAR_HEIGHT,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.tabInactive,
    letterSpacing: -0.2,
  },
  labelActive: { color: '#fff', fontWeight: '700' },

  // Elevated center action button nested into the cradle.
  fabSlot: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: 999,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -(BAR_HEIGHT / 2) - 4.5 }],
    boxShadow: '0px 8px 18px rgba(0,0,0,0.3)',
  },
});
