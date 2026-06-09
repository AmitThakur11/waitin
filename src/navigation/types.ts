/**
 * Root navigation param list. Keep in sync with RootNavigator.
 * `Main` hosts the bottom-tab navigator (Home/Assets/Scan/Privacy/Profile).
 */
export type RootStackParamList = {
  Onboarding: undefined;
  Otp: { phone: string; devCode?: string };
  Main: undefined;
  AddCar: undefined;
  CarDetail: { carId: string };
  Notifications: undefined;
};
