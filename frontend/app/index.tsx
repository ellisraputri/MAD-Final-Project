import { Redirect } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/services/firebase';

export default function Index() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    NavigationBar.setBehaviorAsync("overlay-swipe");
    NavigationBar.setVisibilityAsync("hidden");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("AUTH STATE:", user);
      setUser(user);
    });

    return unsubscribe;
  }, []);

  // ⏳ Still loading
  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // ✅ Logged in
  return <Redirect href="/(tabs)" />;
}