import messaging from '@react-native-firebase/messaging';

export const getFcmToken = async () => {
    return await messaging().getToken();
}
