import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Add real authentication
    router.replace('/'); // Go to tabs after login
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
    >
      {/* Header Image */}
      <ImageBackground
        source={require('../../assets/images/header.png')} // replace with your image
        style={styles.header}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>STEMM LAB</Text>
          <Text style={styles.subtitle}>
            Simulate Reality. Sense the Science
          </Text>
        </View>
      </ImageBackground>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Register */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Don’t have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerLink}>Register here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  header: {
    height: 300,
    justifyContent: 'flex-end',
  },
  overlay: {
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
  },
  form: {
    flex: 1,
    padding: 24,
    backgroundColor: '#EDEDED',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  label: {
    fontSize: 22,
    color: '#388087',
    fontFamily: 'Nunito_700Bold',
    marginTop: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#388087',
    fontSize: 18,
    paddingVertical: 8,
    fontFamily: 'Lato_400Regular',
    marginTop: 8,
  },
  button: {
    marginTop: 50,
    borderWidth: 2,
    borderColor: '#388087',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#388087',
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  registerText: {
    fontSize: 16,
    color: '#388087',
  },
  registerLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#388087',
    textDecorationLine: 'underline',
  },
});