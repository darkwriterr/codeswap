import * as SecureStore from 'expo-secure-store';

export async function saveCredentials(email, password) {
  await SecureStore.setItemAsync("email", email);
  await SecureStore.setItemAsync("password", password);
}

export async function getCredentials() {
  const email = await SecureStore.getItemAsync("email");
  const password = await SecureStore.getItemAsync("password");
  return { email, password };
}

export async function clearCredentials() {
  await SecureStore.deleteItemAsync("email");
  await SecureStore.deleteItemAsync("password");
}
