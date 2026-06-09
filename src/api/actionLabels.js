import {
  Car,
  Lightbulb,
  Ban,
  Wrench,
  Siren,
  MessageSquare,
  Phone,
  Bell,
} from 'lucide-react-native';

const DANGER = '#F0453A';
const BLUE = '#2F6BFF';
const AMBER = '#F59E0B';

/** Mirrors the backend ActionType enum for display in feeds. */
export const ACTION_META = {
  move_car: { icon: Car, text: 'Please move your car', color: BLUE },
  blocking: { icon: Ban, text: "You're blocking someone", color: DANGER },
  lights_on: { icon: Lightbulb, text: 'Your lights are on', color: AMBER },
  damage: { icon: Wrench, text: 'Possible damage reported', color: AMBER },
  emergency: { icon: Siren, text: 'Emergency', color: DANGER },
  custom_message: { icon: MessageSquare, text: 'Message', color: BLUE },
  call: { icon: Phone, text: 'Wants to call you', color: BLUE },
  chat: { icon: MessageSquare, text: 'Wants to chat', color: BLUE },
};

export function actionMeta(type) {
  return ACTION_META[type] ?? { icon: Bell, text: type, color: BLUE };
}
