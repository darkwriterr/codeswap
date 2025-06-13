import React from 'react';

import { View, Text } from "react-native";
import Header from "../../components/ui/Header";

export default function ForumScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Forum Screen</Text>
            </View>
        </View>
    );
}
