import { Redirect } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';

export default function Index() {
  const isLoggedIn = true; // replace later

  useEffect(() => {
    NavigationBar.setBehaviorAsync("overlay-swipe");
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
      <StatusBar hidden={true} />
      <Redirect href="/(tabs)" />
    </>
  );
}