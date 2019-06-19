/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import LoginNative from '../pages/Login/LoginNative.js';

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <LoginNative />
      </View>
    );
  }
}

export default App;
