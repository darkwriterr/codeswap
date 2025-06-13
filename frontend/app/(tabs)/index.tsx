import React from 'react';

import { View, Text } from "react-native";
import Header from "../../components/ui/Header";

export default function HomeScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 24 }}>Home Screen</Text>
            </View>
        </View>
    );
}
