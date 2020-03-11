import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import GPS from './gps';
import { store, persistor } from './Redux/store';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  renderLoading = () => {
    return (
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );
  };

  return (
    // Redux: Global Store
    <Provider store={store}>
      <PersistGate loading={() => renderLoading()} persistor={persistor}>
        <GPS />
      </PersistGate>
    </Provider>
  );
};