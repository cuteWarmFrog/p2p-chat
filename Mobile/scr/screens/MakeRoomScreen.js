import React from 'react';
import { 
  StyleSheet,
  Text,
} from 'react-native';

import { useRoute } from '@react-navigation/core';
import { RootStackScreenProps } from '../types';
import { 
  View
} from '../components/Themed';
import CameraModule from '../components/CameraModule';

export default function MakeCallScreen({ navigation }: RootStackScreenProps<'MakeCall'>) {
  const route = useRoute();
  // @ts-ignore
  console.log(route.params.roomId);

  return (
    <View style={styles.container}>
      <View style={ styles.roomCredits}>
          <Text style={ styles.roomTitle }>
            {/*@ts-ignore*/}
            Your Room ID: { route.params.roomId }
          </Text>
      </View>
      <View style={ styles.parnerCameraContainer}>
          <CameraModule />
      </View>
      <View style={ styles.myCameraContainer }>
        {/* <CameraModule /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerCameraContainer: {

  },
  roomCredits: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: '100%',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16
  },
  roomTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white'
  },
  roomSubtitle: {
    fontSize: 24,
    color: 'white'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%'
  },
  myCameraContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    height: 180,
    width: 110,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  }
});
