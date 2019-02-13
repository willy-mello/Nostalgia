import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon, Expo } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { ANDROID_ID } from './secrets'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoadingComplete: false,
      signedIn: false,
      name: '',
      photoURL: ''
    };

    signIn = async () => {
      try {
        const result = await Expo.Google.logInAsync({
          androidClientId: ANDROID_ID,
          //iosClientId: IOS_ID <-- if I want to use this later
          scopes: ['profile', 'email', 'location']
        })
        if (result.type === 'success') {
          this.setState({
            signIn: true,
            name: result.user.name,
            photoURL: result.user.photoURL
          })
        }
        else { console.log('cancelled') }
      } catch (error) {
        console.error(error)
      }
    }

  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
