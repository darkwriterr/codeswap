// lib/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveCredentials(email: string, password: string) {
    await AsyncStorage.setItem("userEmail", email);
    await AsyncStorage.setItem("userPassword", password);
}

export async function checkCredentials(email: string, password: string): Promise<boolean> {
    const savedEmail = await AsyncStorage.getItem("userEmail");
    const savedPassword = await AsyncStorage.getItem("userPassword");
    return savedEmail === email && savedPassword === password;
}

export async function isUserLoggedIn(): Promise<boolean> {
    const token = await AsyncStorage.getItem("userToken");
    return !!token;
}

export async function loginUser(token: string) {
    await AsyncStorage.setItem("userToken", token);
}

export async function logoutUser() {
    await AsyncStorage.removeItem("userToken");
}

export async function saveUserName(name: string) {
    await AsyncStorage.setItem("userName", name);
}

export async function getUserName(): Promise<string | null> {
    return await AsyncStorage.getItem("userName");
}
