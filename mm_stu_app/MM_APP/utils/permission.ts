import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import { isAndroid } from "./common";

export const requestNotificationPermission = async () => {
  try {
    const result = await request(
      isAndroid()
        ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS
        : PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY
    );
    if (result === RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  } catch (error) {
    console.error('Error requesting notification permission: ', error);
  }
};