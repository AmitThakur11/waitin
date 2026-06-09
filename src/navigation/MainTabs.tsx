import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutGrid, Layers, QrCode, ShieldCheck, Settings, LucideIcon } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { AssetsScreen } from '../screens/AssetsScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { PrivacyScreen } from '../screens/PrivacyScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PressableScale } from '../components/PressableScale';
import { GradientBackground } from '../components/GradientBackground';
import { colors, shadow, gradients } from '../theme';

const Tab = createBottomTabNavigator();

function TabIcon({ icon: Icon, label, focused }: { icon: LucideIcon; label: string; focused: boolean }) {
  const color = focused ? colors.primary : colors.textMuted;
  return (
    <View style={styles.tabItem}>
      <Icon size={22} color={color} strokeWidth={focused ? 2.4 : 2} />
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </View>
  );
}

/** Raised circular FAB used for the center Scan tab. */
function ScanFab({ onPress }: { onPress?: () => void }) {
  return (
    <View style={styles.fabWrap} pointerEvents="box-none">
      <PressableScale style={styles.fab} onPress={onPress} scaleTo={0.9}>
        <GradientBackground id="fabGrad" colors={gradients.primaryFab} radius={30} />
        <View style={styles.fabInner}>
          <QrCode size={26} color="#fff" strokeWidth={2.4} />
        </View>
      </PressableScale>
    </View>
  );
}

const renderTab = (icon: LucideIcon, label: string) =>
  function TabBarIcon({ focused }: { focused: boolean }) {
    return <TabIcon icon={icon} label={label} focused={focused} />;
  };

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: renderTab(LayoutGrid, 'Home') }} />
      <Tab.Screen name="Assets" component={AssetsScreen} options={{ tabBarIcon: renderTab(Layers, 'Assets') }} />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{ tabBarButton: props => <ScanFab onPress={props.onPress as any} /> }}
      />
      <Tab.Screen name="Privacy" component={PrivacyScreen} options={{ tabBarIcon: renderTab(ShieldCheck, 'Privacy') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: renderTab(Settings, 'Profile') }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    height: 64,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', gap: 3, width: 64 },
  tabLabel: { fontSize: 11, fontWeight: '600' },
  fabWrap: { flex: 1, alignItems: 'center' },
  fab: {
    position: 'absolute',
    top: -24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: colors.surface,
    ...shadow,
  },
  fabInner: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});
