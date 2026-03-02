import { Redirect } from 'expo-router';

export default function Index() {
  const isLoggedIn = false; // replace later

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}