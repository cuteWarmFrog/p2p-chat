import firebase from '@react-native-firebase/app';

import messaging from '@react-native-firebase/messaging';

export const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log(fcmToken);
    return fcmToken;
}
