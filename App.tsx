import React from 'react';
import {Text, View} from 'react-native';
// import Map from './Map';
import Mapview from './Mapview';

const App = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Hello, world!</Text>
      <Mapview/>
      {/* <Map/> */}
    </View>
  );
};
export default App;